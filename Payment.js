var check = require("check-type").init();
var moment = require('moment');
var Config = require('./Config');
var Env = require('./env');

var mongojs = require('mongojs');
// var db = mongojs(Config[Env.Current_Environment]['dbUrl'], ['payments']);

var comongo = require('co-mongo');

function validate(amount, paidBy, paidTo, paidOnDate, reason) {
	console.log(amount);

	return  check(amount).is("number") &&
			check(paidBy).is("string") &&
			check(paidTo).is("object") && check(paidTo).is.not("array") &&
			check(paidOnDate).is("string") &&
			check(moment(paidOnDate).toDate()).is("Date") &&
			check(reason).is("string");
}

function Payment(amount, paidBy, paidTo, paidOnDate, reason) {
	if(!validate(amount, paidBy, paidTo, paidOnDate, reason)) {
		console.log("[ERROR]: Payment Object Validation Failed");
		return {};
	}

	var now = moment();
	this.amount 	= amount;
	this.paidBy 	= paidBy;
	this.paidTo 	= paidTo;
	this.paidOnDate = now.toDate();
	this.reason 	= reason;
}

Payment.prototype.save = function *() {
    console.log("this ", this);

    try {
    	var db = yield comongo.connect(Config[Env.Current_Environment].dbUrl);
	  	var payments = yield db.collection('payments');

	  	var saved_payment = yield payments.insert(this);
	  	console.log("[INFO]: Successfully inserted the payment object: " + saved_payment);
    	return saved_payment[0];

    } catch(e) {
    	console.error("[ERROR]: error in inserting the payment object");
    	return null;
    }
}

module.exports = Payment;