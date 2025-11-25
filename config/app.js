var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts'); 
let mongoose = require('mongoose');
let DB = require('./db');
let workoutsRouter = require('../server/routes/workout');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require("passport-local");
let localStrategy = passportLocal.Strategy
let flash = require('connect-flash');
let cors = require('cors');
let userModel = require('../server/models/user');
let User = userModel.User
var app = express();

var indexRouter = require('../server/routes/index');
var usersRouter = require('../server/routes/users');



//TEST DB CONNECTION
mongoose.connect(DB.URI);
let mongodb = mongoose.connection;
mongodb.on('error',console.error.bind(console,'Connection error'));
mongodb.once('open',()=>{
  console.log('Connected to the MongoDB')
});

// Set up Express Session
app.use(session({
  secret:'Somesecret',
  saveUninitialized:false,
  resave:false
}));

// Initialize flash
app.use(flash());

//user authentication
passport.use(User.createStrategy());
//serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, '../server/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts); 
app.set('layout', 'layout'); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/workouts', workoutsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
