var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var passport = require('passport');
var FortyTwoStrategy = require('passport-42').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

passport.use(new FortyTwoStrategy({
  clientID: process.env.FORTYTWO_CLIENT_ID,
  clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:3000/login/42/return'
},
  function (accessToken, refreshToken, profile, cb) {
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


var app = express();

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
    console.log(req.user);
    res.render('profile', { user: req.user });
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
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
