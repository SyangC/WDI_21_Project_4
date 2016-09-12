angular
  .module("ChatBotApp")
  .controller("MainController", MainController)


MainController.$inject = ["$auth", "$state", "$rootScope", "$http"];
function MainController($auth, $state, $rootScope, $http) {

  var self = this;

  this.currentUser = $auth.getPayload();

  this.submit = function(){
    $http({
      method: "GET",
      url: "http://api.brainshop.ai/get?bid=297&key=h48yqtsJpvTaMp36&uid=[uid]&msg=Hello"
    }).then(function(data){
      console.log(data);
    });
  }

  this.logout = function() {
    $auth.logout();
    this.currentUser = null;
    $state.go("login");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
  });
}