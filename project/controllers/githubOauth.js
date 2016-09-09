// var User = require('../models/user');
// var request = require('request-promise');
// var jwt = require('jsonwebtoken');
// var secret = require('../config/tokens').secret;

// function github(req, res) {

//   request.post({
//     url: "https://github.com/login/oauth/access_token",
//     qs: {
//       client_id: process.env.GITHUB_API_KEY,
//       client_secret: process.env.GITHUB_API_SECRET,
//       code: req.body.code,
//     },
//     json: true
//   })
//   .then(function(response){
//     return request.get({
//       url: "https://api.github.com/user",
//       qs: { access_token: response.access_token },
//       headers: { 'User-Agent': 'Request-Promise' }
//     });
//   })
//   .then(function(profile) {
//     return User.findOne({ email: profile.email })
//       .then(function(user) {
//         if(user) {
//           user.githubId = profile.id;
//           user.avatar = profile.avatar_url;
//         }
//         else {
//           // if not, create a new user
//           user = new User({
//             username: profile.login,
//             email: profile.email,
//             githubId: profile.id,
//             avatar: profile.avatar_url
//           });
//         }
//         return user.save();
//       })
//   })
//   .then(function(user) {
//     var payload = {
//       _id: user._id,
//       avatar: user.avatar,
//       username: user.username
//     };

//     var token = jwt.sign(payload, secret, { expiresIn: '24h' });

//     res.status(200).json({ token: token });
//   });

// }

// module.exports = {
//   github: github
// }