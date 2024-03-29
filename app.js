var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var mongo = require("./data/database");
mongo.connectDB();

var app = express();

// view engine setup

app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('./lib/passport')(app);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')(passport);
var authRouter = require('./routes/auth')(passport);
var scheduleRouter = require('./routes/schedule')(passport);
// var adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/schedule', scheduleRouter);
// app.use('/admin', adminRouter);

// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

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
