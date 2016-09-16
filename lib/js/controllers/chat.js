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

  socket.on("message", function(message) {
    $rootScope.$evalAsync(function() {
      self.all.push(message);
    })
  });
}