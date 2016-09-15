angular
  .module("ChatBotApp")
  .controller("RoomsIndexController", RoomsIndexController);

RoomsIndexController.$inject = ["Room", "$state", "$window", "$rootScope"];
function RoomsIndexController(Room, $state, $window, $rootScope) {

  this.all = Room.query();

  var socket = $window.io();

  socket.on("capacityUpdate", function(changes) {
    $rootScope.$evalAsync(function() {
      self.all
    })
  });
}