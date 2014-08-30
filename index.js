var express = require('express');
var logfmt = require('logfmt');
var auth = require('./auth');
var cors = require('cors');
var Config = require('./Config');

var app = express();
var paymentLib = require('./paymentLib');

app.use(logfmt.requestLogger());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", Config.clientUrl_prod);
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

app.post('/payment', function(req, res) {
	console.log(req.body);

	var params = req.body;

	var responseText = '';
	if(paymentLib.addPayment(params, function(err, saved_payment){
		if(err) {
			res.send('not ok');
		}
		else {
			res.send('ok');
		} 
	}));	
});

var logs = require('./logs');
app.get('/logs/:user1/:user2', function(req, res){
	var first = req.params.user1,
		second = req.params.user2;

	logs.details(first, second, function(err, detailsObject){
		if(err) {
			console.log("[ERROR] : error in getting details");
			res.send(null);
		} else {
			res.send(detailsObject);
		}
	})

})

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});