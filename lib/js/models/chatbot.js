angular
  .module("ChatBotApp")
  .factory("Chatbot", Chatbot);

Chatbot.$inject = ["$resource"]
function Chatbot($resource) {
  return $resource('/api/chatbots/:id', { id: '@_id' }, {
    update: { method: "PUT" }
  });
}