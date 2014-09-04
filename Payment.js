var check = require("check-type").init();
var moment = require('moment');
var Config = require('./Config');
var Env = require('./env');

var mongojs = require('mongojs');
var db = mongojs(Config[Env.Current_Environment]['dbUrl'], ['payments']);

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

	this.amount 	= amount;
	this.paidBy 	= paidBy;
	this.paidTo 	= paidTo;
	this.paidOnDate = moment(paidOnDate).toDate();
	this.reason 	= reason;
}

Payment.prototype.save = function (save_callback) {
    console.log(this);
    db.payments.insert(this, function(err, saved_payment) {
    	if(err) {
    		console.log("[ERROR]: error in inserting the payment object");
    		save_callback(err, null);
    	} else {
    		console.log("[INFO]: Successfully inserted the payment object: " + saved_payment);
    		save_callback(null, saved_payment);
    	}
    });

}

module.exports = Payment;