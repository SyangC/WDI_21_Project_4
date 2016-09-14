angular
  .module("ChatBotApp", ["ngResource", "ui.router", "satellizer"])
  .config(oAuthConfig)
  .config(Router);

oAuthConfig.$inject = ["$authProvider"];
function oAuthConfig($authProvider) {
  $authProvider.github({
    url: "/api/oauth/github",
    clientId: "75aa6cdbc3f06f78e597"
  })
  $authProvider.facebook({
    url: "/api/oauth/facebook",
    clientId: "1115097508582543"
  })
  $authProvider.instagram({
    url: "/api/oauth/instagram",
    clientId: "5fe3b4f903aa4241ad49fdc7d5eec3f9"
  })
}

Router.$inject = ["$stateProvider", "$urlRouterProvider"];
function Router($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state("home", {
      url: "/home",
      templateUrl: "/templates/home.html",
      controller: "MainController as main"
    })
    .state("chat", {
      url: "/chat",
      templateUrl: "/templates/chat.html",
      controller: "ChatController as chat"
    })
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: "LoginController as login"
    })
    .state('register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: "RegisterController as register"
    })
    .state('roomsIndex', {
      url: '/rooms',
      templateUrl: '/templates/rooms/roomsIndex.html',
      controller: "RoomsIndexController as roomsIndex"
    })
    .state('roomsShow', {
      url: '/rooms/:id',
      templateUrl: '/templates/rooms/roomsShow.html',
      controller: "RoomsShowController as roomsShow"
    })
    .state('chatbotsIndex', {
      url: '/chatbots',
      templateUrl: '/templates/chatbotsIndex.html',
      controller: "ChatbotsIndexController as chatbotsIndex"
    })
    .state('chatbotsShow', {
      url: '/chatbots/:id',
      templateUrl: '/templates/chatbotsShow.html',
      controller: "ChatbotsShowController as chatbotsShow"
    });

    $urlRouterProvider.otherwise("/home");
}