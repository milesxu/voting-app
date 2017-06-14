const GithubStrategy = require('passport-github').Strategy;
const { authByToken } = require('./util');

//TODO: what if multiple login ways have same email?
// this possibility is high!
module.exports = new GithubStrategy({
  clientID: process.env.GITHUB_KEY,
  clientSecret: process.env.GITHUB_SECRET,
  scope: ['user'],
  callbackURL: process.env.GITHUB_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  authByToken(accessToken, refreshToken, profile, 'github', done);
});