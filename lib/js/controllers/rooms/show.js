angular
  .module("ChatBotApp")
  .controller("RoomsShowController", RoomsShowController);

RoomsShowController.$inject = ["Room", "$state", "$window", "$auth", "$rootScope", "$http"];
function RoomsShowController(Room, $state, $window, $auth, $rootScope, $http) {

  var self = this;

  // typed chat

  this.selected = Room.get({ id: $state.params.id }, function(data) {
    room = data.name;
    console.log(room);
  });

  var socket = $window.io();

  socket.on("connect", function() {
    socket.emit("room", room);
    console.log("Socket room is " + room)
  });

  self.currentUser = $auth.getPayload();

  this.newMessage = null;

  this.all = [];

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
      console.log("This is what is being pushed in: " +message)
      console.log(self.all)
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