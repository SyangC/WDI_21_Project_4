var router = require('express').Router();

var roomsController = require('../controllers/rooms');
var githubController = require('../controllers/githubOauth');
var facebookController = require('../controllers/facebookOauth');
var instagramController = require('../controllers/instagramOauth');
var authController = require('../controllers/auth');

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

router.route('/rooms')
  .get(roomsController.index)
  .post(roomsController.create);

router.route('/rooms/:id')
  .get(roomsController.show)
  .put(roomsController.update)
  .delete(roomsController.delete);

router.post('/oauth/github', githubController.login);
router.post('/oauth/facebook', facebookController.login);
router.post('/oauth/instagram', instagramController.login);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;