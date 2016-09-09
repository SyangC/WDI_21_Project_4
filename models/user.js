var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  githubId: Number,
  facebookId: Number,
  twitterId: Number,
  instagramId: Number,
  avatar: String
});

module.exports = mongoose.model('User', userSchema);