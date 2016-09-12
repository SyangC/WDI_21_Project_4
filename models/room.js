var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Room', roomSchema);