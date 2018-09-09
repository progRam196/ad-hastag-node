
var connection={};

var express = require('express'),
  app = express(),
  path = require('path'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  api = require('./routes/api')(app);

var db = require('./config/dbconnection');
var dbconfig = require('./config/db.json');
var md5 = require('md5');
var base64 = require('base-64');
var q= require('q');
var i18n = require("i18n");
var socket = require( 'socket.io' );
var cors = require( 'cors' );
var expressValidator = require('express-validator');


var apimodel = require('./models/apimodel');
var user = require('./routes/user');
var ad = require('./routes/ad');


app.use(expressValidator());


i18n.configure({
locales: ['en', 'ar'],
  
directory: __dirname + '/locales',
 defaultLocale: 'en',
updateFiles: false, 
  autoReload: true,    
});
app.use(i18n.init);
app.use(cors());

var mongodb= require('mongodb');
var http = require('http');

var server = http.createServer(app);

var io = socket.listen( server );

let socketobj={};


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
  }));

app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());

var options = {
  inflate: true,
  limit: '1mb',
  type: 'application/json'
};
app.use(bodyParser.raw(options));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')))
//app.use('/public', express.static('public'))


// app.use(function(req, res, next) {

//       console.log(req.body);

//   // req.rawBody = '';
//   // req.setEncoding('utf8');

//   // req.on('data', function(chunk) { 
//   //   req.rawBody += chunk;
//   // });

//   req.on('end', function() {
//     next();
//   });
// });

var username = dbconfig.username;
var password = dbconfig.password;
var host = dbconfig.host;
var port = dbconfig.port;
var authMechanism = dbconfig.authMechanism;
var authSource = dbconfig.authSource;
var dbname = dbconfig.dbname;

const url = 'mongodb://'+username+':'+password+'@'+host+':'+port+'/?authMechanism='+authMechanism+'&authSource='+authSource+'&ssl=false"';


db.connect(url,dbname,function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.'+err)
    process.exit(1)
  } else {

  	console.log(i18n.__('db_connect_success'));
  	}
});


app.io           = io;


app.use('/api/user',user);
app.use('/api/ad',ad);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    console.trace(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


require('./websocket')(io);

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

server.listen(port);

module.exports = app;