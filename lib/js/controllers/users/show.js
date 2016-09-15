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