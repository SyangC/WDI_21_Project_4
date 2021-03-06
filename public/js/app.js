angular
  .module("ChatBotApp", ["ngResource", "ui.router", "satellizer"])
  .config(oAuthConfig)
  .config(Router)

oAuthConfig.$inject = ["$authProvider"];
function oAuthConfig($authProvider) {
  $authProvider.github({
    url: "/api/oauth/github",
    clientId: "75aa6cdbc3f06f78e597"
  })
  $authProvider.facebook({
    url: "/api/oauth/facebook",
    clientId: "1115097508582543"
  })
  $authProvider.instagram({
    url: "/api/oauth/instagram",
    clientId: "5fe3b4f903aa4241ad49fdc7d5eec3f9"
  })
}

Router.$inject = ["$stateProvider", "$urlRouterProvider"];
function Router($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state("home", {
      url: "/home",
      templateUrl: "/templates/home.html",
      controller: "MainController as main"
    })
    .state("chat", {
      url: "/chat",
      templateUrl: "/templates/chat.html",
      controller: "ChatController as chat"
    })
    .state("login", {
      url: "/login",
      templateUrl: "/templates/login.html",
      controller: "LoginController as login"
    })
    .state("register", {
      url: "/register",
      templateUrl: "/templates/register.html",
      controller: "RegisterController as register"
    })
    .state("roomsIndex", {
      url: "/rooms",
      templateUrl: "/templates/rooms/roomsIndex.html",
      controller: "RoomsIndexController as roomsIndex"
    })
    .state("roomsShow", {
      url: "/rooms/:id",
      templateUrl: "/templates/rooms/roomsShow.html",
      controller: "RoomsShowController as roomsShow"
    })
    .state("chatbotsIndex", {
      url: "/chatbots",
      templateUrl: "/templates/chatbots/chatbotsIndex.html",
      controller: "ChatbotsIndexController as chatbotsIndex"
    })
    .state("chatbotsShow", {
      url: "/chatbots/:id",
      templateUrl: "/templates/chatbots/chatbotsShow.html",
      controller: "ChatbotsShowController as chatbotsShow"
    })
    .state("usersIndex", {
      url: "/users",
      templateUrl: "/templates/users/usersIndex.html",
      controller: "UsersIndexController as usersIndex"
    })
    .state("usersShow", {
      url: "/users/:id",
      templateUrl: "/templates/users/usersShow.html",
      controller: "UsersShowController as usersShow"
    });

    $urlRouterProvider.otherwise("/home");
}
angular
  .module("ChatBotApp")
  .directive("date", date);

function date() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        return new Date(value);
      });
    }
  }
}
angular
  .module("ChatBotApp")
  .controller("ChatController", ChatController);


ChatController.$inject = ["Chatbot", "$auth", "$state", "$window", "$rootScope", "$http", "ChatBotService"];
function ChatController(Chatbot, $auth, $state, $window, $rootScope, $http, ChatBotService) {

  var self = this;

  this.allBots = Chatbot.query();

  var socket = $window.io();

  this.currentUser = $auth.getPayload();

  this.newMessage = null

  this.all = []

  var currentBot = "";

  currentBot = this.allBots[Math.floor(Math.random() * this.allBots.length)];

  this.sendMessage = function(){
    if(this.newMessage) {
      currentBot = this.allBots[Math.floor(Math.random() * this.allBots.length)];
      socket.emit("message", { content: this.newMessage, name: this.currentUser.username});
      ChatBotService
        .getResponse(this.newMessage, currentBot.bid, this.currentUser._id, currentBot.apikey)
        .then(function(response){
          delay = Math.random() * 2000
          setTimeout(function() {
            socket.emit("message", {
              content: response.data,
              name: currentBot.name
            });
          }, delay);
        }); 
    }

    this.newMessage = null;
  }

  // this.newMessageBotLoop = null

  // this.allLoopMessages= []

  // this.sendMessageBotLoop = function(){
  //   if(this.newMessageBotLoop) {
  //     currentBot = this.allBots[Math.floor(Math.random() * this.allBots.length)];
  //     socket.emit("messageLoop", { content: this.newMessageBotLoop, name: this.currentUser.username});
  //     ChatBotService
  //       .getResponse(this.newMessageBotLoop, currentBot.bid, this.currentUser._id, currentBot.apikey)
  //       .then(function(response){
  //         delay = Math.random() * 2000
  //         setTimeout(function() {
  //           socket.emit("messageLoop", {
  //             content: response.data,
  //             name: currentBot.name
  //           });
  //         }, delay);
  //       }); 
  //   }

  //   this.newMessageBotLoop = null;
  // }

  socket.on("message", function(message) {
    $rootScope.$evalAsync(function() {
      self.all.push(message);
    })
  });

  // socket.on("messageLoop", function(message) {
  //   $rootScope.$evalAsync(function() {
  //     self.allLoopMessages.push(message);
      
  //     delay = Math.random() * 2000
  //     setTimeout(function() {
  //       currentBot = self.allBots[Math.floor(Math.random() * self.allBots.length)];
  //       socket.emit("messageLoop", { content: message.content, name: currentBot.name});
  //       ChatBotService
  //         .getResponse(message.content, currentBot.bid, currentBot._id, currentBot.apikey)
  //         .then(function(response){
  //             socket.emit("messageLoop", {
  //               content: response.data,
  //               name: currentBot.name
  //             });
  //         });

  //     }, delay);
  //   })
  // });
}
angular
  .module("ChatBotApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["$auth", "$state", "$rootScope"];
function LoginController($auth, $state, $rootScope) {

  this.credentials = {};

  this.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        $rootScope.$broadcast("loggedIn");
        $state.go("chat");
      });
  }

  this.submit = function() {
    $auth.login(this.credentials, {
      url: "/api/login"
    }).then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go("chat");
    })
  }
}
angular
  .module("ChatBotApp")
  .controller("MainController", MainController);


MainController.$inject = ["$auth", "$state", "$rootScope", "$http"];
function MainController($auth, $state, $rootScope, $http) {

  var self = this;

  this.currentUser = $auth.getPayload();

  this.logout = function() {
    $auth.logout();
    this.currentUser = null;
    $state.go("login");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
  });
  
  $rootScope.$state = $state;
}
angular
  .module("ChatBotApp")
  .controller("RegisterController", RegisterController);

RegisterController.$inject = ["$auth", "$state", "$rootScope"];
function RegisterController($auth, $state, $rootScope) {

  this.user = {};

  this.submit = function() {
    $auth.signup(this.user, {
      url: '/api/register'
    })
    .then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go("chat");
    })
  }
}
angular
  .module("ChatBotApp")
  .factory("Chatbot", Chatbot);

Chatbot.$inject = ["$resource"]
function Chatbot($resource) {
  return $resource('/api/chatbots/:id', { id: '@_id' }, {
    update: { method: "PUT" }
  });
}
angular
  .module("ChatBotApp")
  .factory("Room", Room);

Room.$inject = ["$resource"]
function Room($resource) {
  return $resource('/api/rooms/:id', { id: '@_id' }, {
    update: { method: "PUT" }
  });
}
angular
  .module("ChatBotApp")
  .factory("User", User);

User.$inject = ["$resource"]
function User($resource) {
  return $resource('/api/users/:id', { id: '@_id' }, {
    update: { method: "PUT" }
  });
}
angular
  .module("ChatBotApp")
  .service("ChatBotService", ChatBotService);

ChatBotService.$inject = ["$http"];
function ChatBotService($http) {
  this.getResponse = function(msg, bid, uid, key) {
    return $http({
      method: "GET",
      url: "/api/chatbots/respond",
      params: {
        msg: msg,
        bid: bid,
        uid: uid,
        key: key
      }
    });
  }
}
angular
  .module("ChatBotApp")
  .controller("ChatbotsIndexController", ChatbotsIndexController);

ChatbotsIndexController.$inject = ["Chatbot", "$state", "$window", "$rootScope"];
function ChatbotsIndexController(Chatbot, $state, $window, $rootScope) {

  this.all = Chatbot.query();

  this.header = 'username';
  this.reverse = true;

  this.sortBy = function(header) {
    this.reverse = (this.header === header) ? !this.reverse : false;
    this.header = header;
  };

}
angular
  .module("ChatBotApp")
  .controller("ChatbotsShowController", ChatbotsShowController);

ChatbotsShowController.$inject = ["Chatbot", "$state"];
function ChatbotsShowController(Chatbot, $state) {
  var self = this;

  this.selected = Chatbot.get({ id: $state.params.id });

  this.update = function() {
    this.selected.$update();
  }
}
angular
  .module("ChatBotApp")
  .controller("RoomsIndexController", RoomsIndexController);

RoomsIndexController.$inject = ["Room", "$state", "$window", "$rootScope"];
function RoomsIndexController(Room, $state, $window, $rootScope) {

  this.all = Room.query();

  var socket = $window.io();

  socket.on("capacityUpdate", function(changes) {
    $rootScope.$evalAsync(function() {
      self.all
    })
  });
}
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
angular
  .module("ChatBotApp")
  .controller("UsersIndexController", UsersIndexController);

UsersIndexController.$inject = ["User", "$state", "$window", "$rootScope"];
function UsersIndexController(User, $state, $window, $rootScope) {

  this.all = User.query();

  this.header = 'username';
  this.reverse = true;

  this.sortBy = function(header) {
    this.reverse = (this.header === header) ? !this.reverse : false;
    this.header = header;
  };

}
angular
  .module("ChatBotApp")
  .controller("UsersShowController", UsersShowController);

UsersShowController.$inject = ["User", "$state"];
function UsersShowController(User, $state) {
  var self = this;

  this.selected = User.get({ id: $state.params.id });

  this.update = function() {
    this.selected.$update();
  }
}