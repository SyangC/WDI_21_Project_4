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

      ChatBotService
        .getResponse(this.newMessage, currentBot.bid, this.currentUser._id, currentBot.apikey)
        .then(function(response){
          socket.emit("roomMessage", {
            content: response.data,
            id: currentBot._id
          });
        });
    }
    this.newMessage = null;
  }

  socket.on("roomMessage", function(message) {
    $rootScope.$evalAsync(function() {
      self.allMessages.push(message);
      console.log(self.allMessages);
    })
  });

  socket.on("playerChanges", function(changes) {
    $rootScope.$evalAsync(function() {
      self.allUsers = changes
      self.selectedRoom.users = changes;
    })
  });

  socket.on("gameStart", function(data) {
    $rootScope.$evalAsync(function() {
      gameState = data.gameState
      console.log("Gamestate is ", gameState)
      currentBot = data.currentBot
      console.log("Bot is ", currentBot)
      self.allPlayers = data.allPlayers
      console.log("Players are ", self.allPlayers)
    })
  });

  var currentBot = "";

  this.addPlayer = function() {
    if(this.allUsers.indexOf(this.currentUser._id) === -1) {
      this.allUsers.push(this.currentUser._id);
      this.selectedRoom.users = this.allUsers;
      socket.emit("playerChanges", this.selectedRoom.users);
      this.selectedRoom.$update();
    } else {
      console.log("You have already joined the game")
    }
  }

  this.removePlayer = function() {
    var i = this.allUsers.indexOf(this.currentUser._id);
    if(i != -1) {
      this.allUsers.splice(i, 1);
    }
    this.selectedRoom.users = this.allUsers;
    socket.emit("playerChanges", this.selectedRoom.users);
    this.selectedRoom.$update();
  }

  this.allPlayers = [];

  this.playerColors = ["player-one", "player-two", "player-three"];

  var gameState = -1;

  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }

  this.gameStart = function() {
    if(this.selectedRoom.users.length === this.selectedRoom.capacity){
      if(gameState === -1) {
        currentBot = this.allBots[Math.floor(Math.random() * this.allBots.length)];
        this.allPlayers = (this.allUsers).slice();
        this.allPlayers.push(currentBot._id);
        shuffle(this.allPlayers);
        socket.emit("gameStart", { gameState: 0, currentBot: currentBot, allPlayers: this.allPlayers });
        console.log("The capacity thing is working");
        gameState = 0;
      } else {
        console.log("The game has already started.");
      }
    } else {
      console.log("The game is not yet ready. Please wait for the room to be full.");
    }
  }

  this.choice = function(user) {
    if(user === currentBot._id) {
      console.log("you are the winner!")
    } else {
      console.log("you lost!")
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

        ChatBotService
          .getResponse(self.message, currentBot.bid, self.currentUser._id, currentBot.apikey)
          .then(function(response){
            socket.emit("roomMessage", {
              content: response.data,
              id: currentBot._id
            });
          });
      }
      self.message = null
    }
  };
}