var express = require('express');
var logfmt = require('logfmt');
var auth = require('./auth');
// var cors = require('cors');
var Config = require('./Config');
var Env = require('./env');

var app = express();
var paymentLib = require('./paymentLib');

var co = require('co');
var thunkify = require('thunkify');

app.use(logfmt.requestLogger());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", Config[Env.Current_Environment]['clientUrl']);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
 });

var bodyParser = require('body-parser');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies


app.post('/auth', function(req, res) {
  	var username = req.body.username,
  		pwd      = req.body.pwd;

  	console.log(username);
	if(auth.isValidUser(username, pwd))
		res.send('ok');
	else res.send('not ok');
});


app.post('/payment', co(function *(req, res) {
	console.log("req", req.body);
	var params = req.body;

	try {
		var saved_payment = yield paymentLib.addPayment(params);
		console.log('saved_payment', saved_payment);
		res.send('ok');
	} catch(e) {
		console.error('ERROR while sending response: ', e );
		res.send('not ok');
	}

}));

var logs = require('./logs');
app.get('/logs/:user1/:user2', co(function *(req, res){
	var first = req.params.user1,
		second = req.params.user2;

	try {
		var detailsObject =	yield logs.details(first, second);
		console.log("Succesfully got the logs for", first, 'and ', second);
		res.send(detailsObject);
	} catch(e) {
		console.error("[ERROR]: while trying to get logs ", e);
		res.send('not ok');
	}
}));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});