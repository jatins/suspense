var Payment = require('./Payment');

var co = require('co');

exports.addPayment = function *(params) {
	console.log(params);
	
	var amount = params.amount,
		paidBy = params.paidBy,
		paidTo = params.paidTo,
		paidOnDate = params.paidOnDate,
		reason = params.reason;

	try {
		var payment = new Payment(amount, paidBy, paidTo, paidOnDate, reason);
		console.log('Payment:' + payment);

		var saved_payment = yield payment.save();
		return saved_payment;
	} catch (e) {
		console.error("[ERROR]: ", e);
		throw e;
		return null;
	}
};