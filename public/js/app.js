angular
  .module("ChatBotApp", ["ngResource", "ui.router", "satellizer"])
  .config(oAuthConfig)
  .config(Router);

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
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: "LoginController as login"
    })
    .state('register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: "RegisterController as register"
    })
    .state('roomsIndex', {
      url: '/rooms',
      templateUrl: '/templates/rooms/roomsIndex.html',
      controller: "RoomsIndexController as roomsIndex"
    })
    .state('roomsShow', {
      url: '/rooms/:id',
      templateUrl: '/templates/rooms/roomsShow.html',
      controller: "RoomsShowController as roomsShow"
    })
    .state('chatbotsIndex', {
      url: '/chatbots',
      templateUrl: '/templates/chatbotsIndex.html',
      controller: "ChatbotsIndexController as chatbotsIndex"
    })
    .state('chatbotsShow', {
      url: '/chatbots/:id',
      templateUrl: '/templates/chatbotsShow.html',
      controller: "ChatbotsShowController as chatbotsShow"
    });

    $urlRouterProvider.otherwise("/home");
}
angular
  .module("ChatBotApp")
  .controller("ChatController", ChatController);


ChatController.$inject = ["$auth", "$state", "$window", "$rootScope", "$http"];
function ChatController($auth, $state, $window, $rootScope, $http) {

  var self = this;

  // logged in/logged out

  this.logout = function() {
    $auth.logout();
    this.currentUser = null;
    $state.go("login");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
  });

  // typed chat

  var socket = $window.io();

  this.currentUser = $auth.getPayload();

  this.newMessage = null

  this.all = []

  this.sendMessage = function(){
    if(this.newMessage) {
      console.log(this.newMessage)
      socket.emit("message", this.newMessage);
      $http({
        method: "GET",
        url: "http://api.brainshop.ai/get?bid=297&key=h48yqtsJpvTaMp36&uid=" + this.currentUser._id + "c&msg=" + this.newMessage,
        dataType: "jsonp",
      }).then(function(response){
        console.log(response.data.cnt);
        socket.emit("message", response.data.cnt);
      });
    }

    this.newMessage = null;
  }

  socket.on("message", function(message) {
    $rootScope.$evalAsync(function() {
      self.all.push(message);
    })
  });

  // game choice

  // this.choice = function(guess) {
  //   if(guess === "HOOMAN") {
  //     if() {

  //     } else {
        
  //     }
  //   } else {

  //   }
  // }

  // Speech recognition

  this.rec = new webkitSpeechRecognition();
  this.final = "";
  this.message = "";
  this.rec.continuous = false;
  this.rec.lang = "en-US";
  this.rec.onerror = function(event) {
    console.log("error!");
  };

  this.start = function() {
    self.rec.start();
  };
  
  this.rec.onresult = function(event) {
    for(var i = event.resultIndex; i < event.results.length; i++) {
      if(event.results[i].isFinal) {
        self.final = self.final.concat(event.results[i][0].transcript);
        console.log(event.results[i][0].transcript);
        self.message = event.results[i][0].transcript
        socket.emit("message", self.message);
        $http({
          method: "GET",
          url: "http://api.brainshop.ai/get?bid=297&key=h48yqtsJpvTaMp36&uid=" + self.currentUser._id + "c&msg=" + self.message,
          dataType: "jsonp",
        }).then(function(response){
          console.log(response.data.cnt);
          socket.emit("message", response.data.cnt);
        });
      }
      this.message = null
      this.final = null
    }
  };
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
        $state.go("home");
      });
  }

  this.submit = function() {
    $auth.login(this.credentials, {
      url: "/api/login"
    }).then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go("home");
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
      $state.go("home");
    })
  }
}
angular
  .module('ChatBotApp')
  .directive('date', date);

function date() {
  return {
    restrict: 'A',
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
  .controller("RoomsIndexController", RoomsIndexController);

RoomsIndexController.$inject = ["Room", "$state"];
function RoomsIndexController(Room, $state) {

  this.all = Room.query();

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
