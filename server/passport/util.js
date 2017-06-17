const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('mongoose').model('User');

const getSign = (user, done) => {
  let payload;
  if (user.kind === 'local')
    payload = { sub: user.id };
  else
    payload = { sub: user.password };
  const data = { name: user.name };
  const token = jwt.sign(payload, process.env.SECRET_STRING, {
    expiresIn: '1h'
  });
  return done(null, token, data);
}

const authByToken = (accessToken, refreshToken, profile, kind, done) => {
  User.findOne({
    //name: profile.displayName,
    //kind: kind,
    email: profile.emails[0].value
  }).then(usr => {
    let updated;
    if (usr) {
      updated =
        User.findByIdAndUpdate(usr.id, { $set: { token: accessToken } });
    } else {
      const user = new User({
        email: profile.emails[0].value,
        token: accessToken,
        kind,
        name: profile.displayName
      });
      updated = user.save();
    }
    return updated;
  }).then(u => getSign(u, done)).catch(err => done(err));
}

const callbackRedirect = (req, res, kind, next) => {
  passport.authenticate(kind, (err, token, data) => {
    console.log(err);
    let url = '/auth/social/';
    if (err) {
      url += `fail?err=${encodeURIComponent(err.toString())}`;
    }
    else {
      url += `success?token=${encodeURIComponent(token)}`;
      url += `&user=${encodeURIComponent(data.name)}`;
    }
    res.redirect(url);
  })(req, res, next);
}
module.exports = { getSign, authByToken, callbackRedirect };