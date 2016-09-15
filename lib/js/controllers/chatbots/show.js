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