const FacebookStrategy = require('passport-facebook').Strategy;
const { authByToken } = require('./util');

module.exports = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APPID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  //passReqToCallback: true,
  profileFields: ['displayName', 'emails'],
  enableProof: true
}, (accessToken, refreshToken, profile, done) => {
  //console.log(accessToken);
  //console.log(profile);
  authByToken(accessToken, refreshToken, profile, 'facebook', done);
});