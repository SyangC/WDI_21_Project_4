var mongoose = require('mongoose');
var Room = require('../models/room');
var Chatbot = require('../models/chatbot');
var databaseUri = require("../config/db")(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);

Room.collection.drop();
Chatbot.collection.drop();

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
}], function(err, rooms) {
  if(!err) console.log("Rooms created!");

  Chatbot.create([{
    name: "Aco",
    bid: 297,
    apikey: "h48yqtsJpvTaMp36"
  }, {
    name: "Aco",
    bid: 307,
    apikey: "HvAYTrjZMVnZ1CqS"
  }], function(err, chatbots) {
    if(!err) console.log("Chatbots created!");
    mongoose.connection.close();
  });
});