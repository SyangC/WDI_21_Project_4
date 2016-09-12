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
  .factory("Room", Room);

Room.$inject = ["$resource"];
function Room($resource) {
  return $resource('/api/rooms/:id', { id: '@_id' },  {
    update: { method: "PUT" }
  });
}