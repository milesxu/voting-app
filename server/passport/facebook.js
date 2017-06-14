const FacebookStrategy = require('passport-facebook').Strategy;
const { authByToken } = require('./util');

module.exports = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APPID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['emails'],
}, (accessToken, refreshToken, profile, done) => {
  authByToken(accessToken, refreshToken, profile, 'facebook', done);
});