var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

io = require('socket.io');

var mongoose = require('mongoose');


//******* DEFINING ALL ROUTES *******//

var users = require('./routes/users');
var session = require('./routes/session');
var hierarchy = require('./routes/hierarchy');
var verify = require('./routes/verify');
var saveImage = require('./routes/saveImage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.static('views'));


//**** CALLING ROUTES ***//

app.use('/users', users);
app.use('/createSession', session);
app.use('/viewSession', session);
app.use('/createHierarchy', hierarchy);
app.use('/verify', verify);
app.use('/saveImage', saveImage);
app.use('/verify/:email', verify);

//*****  DATABASE CONNECTION ****** //

var __databaseURLS = [
    {
        uri     : 'mongodb://basic:basic@ds117485.mlab.com:17485/basicapp',
        dbName  : 'basicdb'
    }
]

var __selectedDatabase = __databaseURLS[0];

mongoose.connect( __selectedDatabase.uri);

var db = mongoose.connection;
db
.on('connected', function() {
    console.log(' Database   : ' , __selectedDatabase.dbName);
})

.on('error', console.error.bind(console, 'MongoDB connection error:'));



//*** SOCKET IMPLEMENTATION  ***//

var server = require('http').Server(app);
var io = require('socket.io')(server);


//send first response file
app.get('*', function(req, res) {
  res.sendFile("index.html",{root:__dirname}); // load the single view file (angular will handle the page changes on the front-end)
  // res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


module.exports = {app:app, server:server};
