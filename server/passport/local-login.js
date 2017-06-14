
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
    password: password.trim()
  };

  User.findOne({ email: UserData.email }).then(usr => {
    if (!usr) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialError';
      throw error;
    }
    return usr.comparePassword(UserData.password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialError';
        return done(error);
      }
      return getSign(usr, done);
    });
  })
    .catch(err => done(err));
});