var User = require('../models/user');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var secret = require("../config/tokens").secret;

function login(req, res) {

  request.post({
    url: "https://api.instagram.com/oauth/access_token",
    form: {
      client_id: process.env.INSTAGRAM_API_KEY,
      client_secret: process.env.INSTAGRAM_API_SECRET,
      code: req.body.code,
      grant_type: 'authorization_code',
      redirect_uri: req.body.redirectUri
    },
    json: true
  }).then(function(profile){
    return User.findOne({ email: profile.email })
      .then(function(user) {
        if(user) {
          user.instagramId = profile.id;
          user.avatar = profile.profile_picture;
        }
        else {
          user = new User({
            username: profile.login,
            email: profile.email,
            instagramId: profile.id,
            avatar: profile.profile_picture
          });
        }

        return user.save();
      })
  })
  .then(function(user) {
    var payload = {
      _id: user._id,
      avatar: user.avatar,
      username: user.username
    }

    var token = jwt.sign(payload, secret, { expiresIn: '24h' });

    res.status(200).json({ token: token });

  })
}

module.exports = {
  login: login
}