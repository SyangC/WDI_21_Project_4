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