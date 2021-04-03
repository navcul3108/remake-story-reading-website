const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");

const storyRouter = require('./routes/story');
const usersRouter = require('./routes/users');
const genreRouter = require("./routes/genre");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'rVtPiVabab',
    resave: true,
    saveUninitialized: false
  }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.session.user){
    res.locals.user=req.session.user;
    res.locals.lastName = req.session.lastName;
    res.locals.isAdmin = req.session.isAdmin;
  }
  next();
  //next(createError(404));
});

app.use('/story', storyRouter);
app.use('/users', usersRouter);
app.use("/genre", genreRouter);

app.get("/", (req, res)=>{
  res.redirect("story/");
})

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
