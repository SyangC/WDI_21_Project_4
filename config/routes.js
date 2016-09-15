var router = require('express').Router();

var githubController = require('../controllers/githubOauth');
var facebookController = require('../controllers/facebookOauth');
var instagramController = require('../controllers/instagramOauth');
var authController = require('../controllers/auth');
var roomsController = require('../controllers/rooms');
var chatbotsController = require('../controllers/chatbots');
var usersController = require('../controllers/users');

var jwt = require('jsonwebtoken');
var secret = require('./tokens').secret;
// var upload = require('./upload');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload) {
    if(err || !payload) return res.status(401).json({ message: "Unauthorized" });

    req.user = payload;
    next();
  });
}

router.get('/chatbots', chatbotsController.index)
router.get('/chatbots/respond', chatbotsController.respond);

router.route('/chatbots/:id')
  .get(chatbotsController.show)
  .put(chatbotsController.update)

router.get('/rooms', roomsController.index)
router.route('/rooms/:id')
  .get(roomsController.show)
  .put(roomsController.update)

router.get('/users', usersController.index)
router.route('/users/:id')
  .get(usersController.show)
  .put(usersController.update)

router.post('/oauth/github', githubController.login);
router.post('/oauth/facebook', facebookController.login);
router.post('/oauth/instagram', instagramController.login);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;