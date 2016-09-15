var mongoose = require('mongoose');

var chatbotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bid: { type: Number, required: true },
  apikey: { type: String, required: true },
  gamesPlayed: { type: Number, default: 0 },
  numberDeceived: { type: Number, default: 0 }
});

module.exports = mongoose.model('Chatbot', chatbotSchema);