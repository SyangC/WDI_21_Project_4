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