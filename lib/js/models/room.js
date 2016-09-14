angular
  .module("ChatBotApp")
  .factory("Room", Room);

Room.$inject = ["$resource"]
function Room($resource) {
  return $resource('/api/rooms/:id', { id: '@_id' }, {
    update: { method: "PUT" }
  });
}