const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { authByToken } = require('./util');

module.exports = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_KEY,
  callbackURL: process.env.GOOGLE_CALLBACK,
}, (accessToken, refreshToken, profile, done) => {
  authByToken(accessToken, refreshToken, profile, 'google', done);
})