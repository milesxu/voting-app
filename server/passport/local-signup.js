const User = require('mongoose').model('User');
const LocalStrategy = require('passport-local').Strategy;
const { getSign } = require('./util');

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false
}, (req, email, password, done) => {
  const UserData = {
    email: email.trim(),
    password: password.trim(),
    kind: 'local',
    name: req.body.name.trim()
  };

  const newUser = new User(UserData);
  newUser.save().then(usr => getSign(usr, done))
    .catch(err => done(err));
});