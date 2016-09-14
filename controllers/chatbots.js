var Chatbot = require('../models/chatbot');
var request = require('request-promise');

function chatbotIndex(req, res) {
  Chatbot.find()
    .then(function(chatbots) {
      res.status(200).json(chatbots)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function chatbotShow(req, res) {
  Chatbot.findById(req.params.id)
    .then(function(chatbot) {
      res.status(200).json(chatbot);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function chatbotUpdate(req, res) {
  Chatbot.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(function(chatbot) {
      res.status(200).json(chatbot);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function respond(req, res) {
  request.get({
    url: "http://api.brainshop.ai/get",
    qs: req.query,
    json: true
  })
  .then(function(response) {
    console.log(response);
    return res.status(200).json(response.cnt);
  })
  .catch(function(err) {
    console.log(err);
    return res.status(500).send();
  });
}

module.exports = {
  respond: respond
}

module.exports = {
  index: chatbotIndex,
  show: chatbotShow,
  update: chatbotUpdate,
  respond: respond
}
