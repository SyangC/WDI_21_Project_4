var mongoose = require('mongoose');
var Room = require('../models/room');
var databaseUri = require("../config/db")(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);

Room.collection.drop();

Room.create([
{
  name: "Alpha",
  capacity: 3,
  messages: [],
  currentUserId: []
}, {
  name: "Beta",
  capacity: 3,
  messages: [],
  currentUserId: []
}, {
  name: "Charlie",
  capacity: 5,
  messages: [],
  currentUserId: []
}, {
  name: "Delta",
  capacity: 5,
  messages: [],
  currentUserId: []
}, {
  name: "Echo",
  capacity: 7,
  messages: [],
  currentUserId: []
}], function(err, room) {
  if(!err) console.log("Room created!");
  mongoose.connection.close();
});