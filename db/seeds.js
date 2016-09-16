var mongoose = require('mongoose');
var Room = require('../models/room');
var Chatbot = require('../models/chatbot');
var User = require('../models/user');
var databaseUri = require("../config/db")(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);

Room.collection.drop();
Chatbot.collection.drop();
User.collection.drop();

Room.create([{
  name: "Alpha",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Beta",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Charlie",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Delta",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Echo",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Foxtrot",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Gamma",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Hotel",
  capacity: 2,
  messages: [],
  users: []
}, {
  name: "Indigo",
  capacity: 2,
  messages: [],
  users: []
}], function(err, rooms) {
  if(!err) console.log("Rooms created!");

  Chatbot.create([{
    name: "Mike",
    bid: 297,
    apikey: "h48yqtsJpvTaMp36"
  }, {
    name: "Chanse",
    bid: 313,
    apikey: "jFiMyd9pWveOPzox"
  }, {
    name: "Rosie",
    bid: 314,
    apikey: "PhbcWXSX35vmo4uh"
  }], function(err, chatbots) {
    if(!err) console.log("Chatbots created!");
      
      User.create([{
        username: "shuisawesome",
        email: "shu@me.com",
        password: "password",
        passwordConfirmation: "password"
      }, {
        username: "test",
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password"
      }, {
        username: "test2",
        email: "test2@test.com",
        password: "password",
        passwordConfirmation: "password"
      }, {
        username: "test3",
        email: "test3@test.com",
        password: "password",
        passwordConfirmation: "password"
      }], function(err, users) {
        if(!err) console.log("Users created!");
      mongoose.connection.close();
    });
  });
});