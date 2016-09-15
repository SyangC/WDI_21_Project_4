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