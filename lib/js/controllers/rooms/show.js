angular
  .module("ChatBotApp")
  .controller("RoomsShowController", RoomsShowController);

RoomsShowController.$inject = ["Room", "User", "Chatbot", "$state", "$window", "$auth", "$rootScope", "ChatBotService"];
function RoomsShowController(Room, User, Chatbot, $state, $window, $auth, $rootScope, ChatBotService) {
  var self = this;

  this.allBots = Chatbot.query();

  var socket = $window.io();

  socket.on("connect", function() {
    self.selectedRoom = Room.get({ id: $state.params.id }, function(data) {
      room = data.name;
      self.allUsers = data.users;
      socket.emit("room", room);
    });
  });

  self.currentUser = $auth.getPayload();

  this.newMessage = null;

  this.allMessages = [];

  this.sendMessage = function(){
    if(this.newMessage) {
      socket.emit("roomMessage", { content: this.newMessage, id: this.currentUser._id});

      var rand = Math.random()
      if(rand <= 0.65) {
        ChatBotService
          .getResponse(this.newMessage, currentBot.bid, this.currentUser._id, currentBot.apikey)
          .then(function(response){
            delay = Math.random() * 2000
            setTimeout(function() {
              socket.emit("roomMessage", {
                content: response.data,
                id: currentBot._id
              });
            }, delay);
          }); 
      }
    }
    this.newMessage = null;
  }

  socket.on("roomMessage", function(message) {
    $rootScope.$evalAsync(function() {
      self.allMessages.push(message);
    })
  });

  socket.on("playerChanges", function(changes) {
    $rootScope.$evalAsync(function() {
      self.allUsers = changes
      self.selectedRoom.users = changes;
      if(self.selectedRoom.users.length === self.selectedRoom.capacity && self.allUsers.indexOf(self.currentUser._id) !== -1) {
        addButton[0].disabled = "disabled";
        startButton[0].disabled = "";
      } else if (self.selectedRoom.users.length === self.selectedRoom.capacity) {
        addButton[0].disabled = "disabled";
        startButton[0].disabled = "disabled";
      } else if(self.selectedRoom.users.length < self.selectedRoom.capacity && self.allUsers.indexOf(self.currentUser._id) === -1) {
        addButton[0].disabled = "";
        startButton[0].disabled = "disabled";
      } else if (self.selectedRoom.users.length < self.selectedRoom.capacity && self.allUsers.indexOf(self.currentUser._id) !== -1) {
        addButton[0].disabled = "";
        startButton[0].disabled = "";
      }
    })
  });

  socket.on("gameStart", function(data) {
    $rootScope.$evalAsync(function() {
      if(self.allUsers.indexOf(self.currentUser._id) !== -1) {
        self.gameState = data.gameState;
        currentBot = data.currentBot;
        self.allPlayers = data.allPlayers;
        counter();
        self.userToBeUpdated = User.get({ id: self.currentUser._id }, function(user) {
          user.gamesPlayed = Number(user.gamesPlayed) + 1
          user.$update();
        });
        self.botToBeUpdated = Chatbot.get({ id: currentBot._id }, function(bot) {
          bot.gamesPlayed = Number(bot.gamesPlayed) + 1
          bot.$update();
        });
      }
    })
  });

  var currentBot = "";

  var addButton = document.getElementsByClassName("add-button");

  var leaveButton = document.getElementsByClassName("leave-button");

  var startButton = document.getElementsByClassName("start-button");

  this.addPlayer = function() {
    if(this.allUsers.indexOf(this.currentUser._id) === -1 && this.selectedRoom.users.length < this.selectedRoom.capacity) {
      this.allUsers.push(this.currentUser._id);
      this.selectedRoom.users = this.allUsers;
      this.selectedRoom.$update();
      addButton[0].disabled = "disabled";
      leaveButton[0].disabled = "";
      socket.emit("playerChanges", this.selectedRoom.users);
      socket.emit("capacityUpdate", { users: this.selectedRoom.users, room: this.selectedRoom});
    } else if(this.allUsers.indexOf(this.currentUser._id) === -1) {
      document.getElementById("content").innerHTML = "The game is full!";
    } else {
      document.getElementById("content").innerHTML = "You have already joined the game";
    }
  }

  this.removePlayer = function() {
    var i = this.allUsers.indexOf(this.currentUser._id);
    if(i != -1) {
      this.allUsers.splice(i, 1);
    }
    this.selectedRoom.users = this.allUsers;
    addButton[0].disabled = "";
    leaveButton[0].disabled = "disabled";
    socket.emit("playerChanges", this.selectedRoom.users);
    this.selectedRoom.$update();
  }

  this.allPlayers = [];

  this.playerColors = ["player-one", "player-two", "player-three"];

  this.gameState = -1;

  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }

  var counter;

  function counter() {
    counter = setInterval(timer, 1000);
  }

  this.count = 120
  var count = 120;
  function timer() {
    count = count-1;
    this.count = Math.floor((100/120)*count)
    var timer = document.getElementsByClassName("timer");
    timer[0].style.width = this.count + "%";
    if(count <= 0) {
      gameEnd();
      clearInterval(counter);
      return;
    }
  }

  this.gameStart = function() {
    if(this.selectedRoom.users.length === this.selectedRoom.capacity){
      if(this.gameState === -1) {
        currentBot = this.allBots[Math.floor(Math.random() * this.allBots.length)];
        this.allPlayers = (this.allUsers).slice();
        this.allPlayers.push(currentBot._id);
        shuffle(this.allPlayers);
        this.gameState = 0;
        socket.emit("gameStart", { gameState: this.gameState, currentBot: currentBot, allPlayers: this.allPlayers });
      } else if(this.gameState === 0) {
        document.getElementById("content").innerHTML = "The game is currently in progress.";
      } else{
        document.getElementById("content").innerHTML = "The game is over!";
      }
    } else {
      document.getElementById("content").innerHTML = "The game is not yet ready. Please wait for the room to be full.";
    }
  }

  var gameEnd = function() {
    self.gameState = 1
    document.getElementById("content").innerHTML = "The timer is up!";
  }

  var chosen = 0

  this.choice = function(user) {
    if(this.gameState === 1 && chosen === 0) {
      if(user === currentBot._id) {
        chosen = 1
        document.getElementById("content").innerHTML = "You chose...wisely!";
        this.userToBeUpdated = User.get({ id: this.currentUser._id }, function(user) {
          user.rightGuess = Number(user.rightGuess) + 1
          user.$update();
        });
      } else {
        chosen = 1
        document.getElementById("content").innerHTML = "You chose...poorly!";
        this.botToBeUpdated = Chatbot.get({ id: currentBot._id }, function(bot) {
          bot.numberDeceived = Number(bot.numberDeceived) + 1
          bot.$update();
        });
      }
    } else {
      document.getElementById("content").innerHTML = "You have already made your choice!";
    }
  }

  var speechRecognition = new webkitSpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.lang = "en-GB";
  speechRecognition.onerror = function(event) {
    console.log("error!");
  };

  this.message = null;

  this.start = function() {
    speechRecognition.start();
  };
  
  speechRecognition.onresult = function(event) {
    for(var i = event.resultIndex; i < event.results.length; i++) {
      if(event.results[i].isFinal) {
        self.message = event.results[i][0].transcript
        socket.emit("roomMessage", { content: self.message, id: self.currentUser._id});

        var rand = Math.random()
        if(rand <= 0.65) {
          ChatBotService
            .getResponse(self.message, currentBot.bid, self.currentUser._id, currentBot.apikey)
            .then(function(response) {
              delay = Math.random() * 2000
              setTimeout(function() {
                socket.emit("roomMessage", {
                  content: response.data,
                  id: currentBot._id
                });
              }, delay);
            });
        }
      }
      self.message = null
    }
  };
}