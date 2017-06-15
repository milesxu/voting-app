const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();
const dbUrl = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds062339.mlab.com:62339/mongo`
mongoose.connect(dbUrl);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', () => console.error('connect fail!'));
/*db.once('open', () => {
});*/
require('./server/model/user');
require('./server/model/poll');
require('./server/model/voterecord');

let app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const localSignupStrategy = require('./server/passport/local-signup');
passport.use('local-signup', localSignupStrategy);
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-login', localLoginStrategy);
//const authCheck = require('./server/auth-check');
//app.use('/api/update', authCheck);
const GithubStrategy = require('./server/passport/github');
passport.use(GithubStrategy);
const FacebookStrategy = require('./server/passport/facebook');
passport.use(FacebookStrategy);
const TwitterStrategy = require('./server/passport/twitter');
passport.use(TwitterStrategy);
const GoogleStrategy = require('./server/passport/google');
passport.use(GoogleStrategy);

const authRoutes = require('./server/route/auth');
app.use('/auth', authRoutes);
const apiGet = require('./server/route/api-get');
app.use('/api/get', apiGet);
const apiUpdate = require('./server/route/api-update');
app.use('/api/update', apiUpdate);
app.listen(process.env.PORT, () => console.log('App is running!'));