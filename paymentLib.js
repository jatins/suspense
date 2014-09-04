var Payment = require('./Payment');

exports.addPayment = function(params, callback) {
	console.log(params);
	
	var amount = params.amount,
		paidBy = params.paidBy,
		paidTo = params.paidTo,
		paidOnDate = params.paidOnDate,
		reason = params.reason;

	var payment = new Payment(amount, paidBy, paidTo, paidOnDate, reason);
	console.log('Payment:' + payment);
	payment.save(function(err, saved_payment) {
		if(err) {
			callback(err, null);
		} else {
			callback(null, saved_payment);
		}
	})
}