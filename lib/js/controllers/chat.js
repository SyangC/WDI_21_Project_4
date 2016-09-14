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