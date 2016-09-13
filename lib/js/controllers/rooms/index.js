angular
  .module("ChatBotApp")
  .controller("RoomsIndexController", RoomsIndexController);

RoomsIndexController.$inject = ["Room", "$state"];
function RoomsIndexController(Room, $state) {

  this.all = Room.query();

}