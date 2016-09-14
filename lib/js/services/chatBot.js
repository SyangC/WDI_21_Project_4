angular
  .module("ChatBotApp")
  .service("ChatBotService", ChatBotService);

ChatBotService.$inject = ["$http"];
function ChatBotService($http) {
  this.getResponse = function(msg, bid, uid, key) {
    return $http({
      method: "GET",
      url: "/api/chatbots/respond",
      params: {
        msg: msg,
        bid: bid,
        uid: uid,
        key: key
      }
    });
  }
}