var Room = require('../models/room');
var User = require('../models/user');

function roomIndex(req, res) {
  Room.find()
    .then(function(rooms) {
      res.status(200).json(rooms)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function roomShow(req, res) {
  Room.findById(req.params.id)
    .then(function(room) {
      res.status(200).json(room);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function roomUpdate(req, res) {
  Room.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(function(room) {
      res.status(200).json(room);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

module.exports = {
  index: roomIndex,
  show: roomShow,
  update: roomUpdate
}
