var mongoose = require('mongoose');

var chatbotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bid: { type: Number, required: true },
  apikey: { type: String, required: true }
});

module.exports = mongoose.model('Chatbot', chatbotSchema);