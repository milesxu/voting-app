const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK
}, (token, tokenSecret, profile, done) => {
  console.log(token);
  console.log(tokenSecret);
  console.log(profile);
  done(null, token, profile);
});