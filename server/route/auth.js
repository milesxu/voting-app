const express = require('express');
const validator = require('validator');
const passport = require('passport');
const User = require('mongoose').model('User');
const { callbackRedirect } = require('../passport/util');

const router = express.Router();

function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string'
    || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
  const vResult = validateSignupForm(req.body);
  if (!vResult.success) {
    return res.status(400).json({
      success: false,
      message: vResult.message,
      errors: vResult.errors
    });
  }

  return passport.authenticate('local-signup', (err, token, userData) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now yo should be able to log in.',
      token,
      user: userData
    });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  //console.log(req.body);
  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

router.get('/duplicate/:email', (req, res) => {
  User.count({ email: req.params.email }, (err, count) => {
    if (err)
      return res.status(500).send('Database query failed.');
    return res.json({ count });
  });
});

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', (req, res, next) => {
  callbackRedirect(req, res, 'github', next);
});

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', (req, res, next) => {
  callbackRedirect(req, res, 'facebook', next);
});

/*router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', (req, res, next) => {
  callbackRedirect(req, res, 'twitter', next);
});*/

router.get('/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/google/callback', (req, res, next) => {
  callbackRedirect(req, res, 'google', next);
});

router.get('/social/success', (req, res) => {
  res.end('Login successfully!');
});

router.get('/social/fail', (req, res) => {
  res.end('Login failed, please retry.');
})

module.exports = router;