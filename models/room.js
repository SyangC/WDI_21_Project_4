var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, requred: true },
  messages: [],
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Room', roomSchema);