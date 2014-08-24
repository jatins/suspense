var express = require('express');
var logfmt = require('logfmt');
var auth = require('./auth');
var cors = require('cors');

var app = express();

app.use(logfmt.requestLogger());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
 });

var bodyParser = require('body-parser');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

// app.get('/*', function(req, res, next) {
// 	// if(auth.isValidUser(username, pwd))
// 		next();
// });

app.post('/auth', function(req, res) {
  	var username = req.body.username,
  		pwd      = req.body.pwd;

  	console.log(username);
	if(auth.isValidUser(username, pwd))
		res.send('ok');
	else res.send('not ok');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});