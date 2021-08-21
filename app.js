require('dotenv').config()
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('passport');
const FortyTwoStrategy = require('passport-42').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

passport.use(new FortyTwoStrategy({
  clientID: process.env.FORTYTWO_CLIENT_ID,
  clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/login/42/return',
  passReqToCallback: true,
},
  function (req, accessToken, refreshToken, profile, cb) {
    req.session.accessToken = accessToken;
    console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: '!Seoul' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  res.render('home', { user: req.user });
});

app.get('/login',
  function (req, res) {
    res.render('login');
  });

app.get('/login/42',
  passport.authenticate('42'));

app.get('/login/42/return',
  passport.authenticate('42', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/profile',
  ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });

app.get('/data',
  ensureLoggedIn(),
  function (req, res) {
    const accessToken = req.session.accessToken;
    console.log(accessToken);
    const got = require('got');
    got.get('https://api.intra.42.fr/v2/campus', { 'headers': {
      'authorization': 'bearer ' + accessToken
    }})
    .then(async response => {
      const { Model, DataTypes } = require('sequelize');
      const sequelize = require('./config/db');
      class Campus extends Model { }
      Campus.init({
        data: DataTypes.JSON,
      }, { sequelize, modelName: 'campus' });

      await sequelize.sync();
      const raw = JSON.parse(response.body);
      raw.sort((a, b) => (a.id > b.id) ? 1 : -1);
      raw.forEach(item => {
        if (!item.website.match(/^http/)) {
          item.website = 'https://' + item.website;
        }
      })

      res.render('data', { user: req.user, data: raw });
    })
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
