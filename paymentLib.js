var Payment = require('./Payment');

var logCache = require('./simple-cache');
var cacheInstance = logCache.instance,
    LogKey        = logCache.LogKey,
    LogValue      = logCache.LogValue;

var co = require('co');

/**
 * update cache on insert
 */
function updateCache(payment){
	var first = payment.paidBy;
	var paidToObject = payment.paidTo;

	for(var person in paidToObject) {
		if(!paidToObject.hasOwnProperty(person))
			continue;

		var objToPush = {
			paidBy: first,
			paidTo: {},
			_id: payment._id
		};

		objToPush.paidTo[person] = paidToObject[person];
		
		var second     = person,
		    key        = new LogKey(first, second),
			reverseKey = new LogKey(second, first),
			oldValue   = cacheInstance.read(key);


		// note that log is updated for a key only if it exists
		// ie it is not create by the update function, it will be created on first read
		if(oldValue) {
			oldValue.expenditure.push(objToPush);
			cacheInstance.update(key, oldValue);
		}

		
	}
}

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
		updateCache(saved_payment);
		return saved_payment;
	} catch (e) {
		console.error("[ERROR]: ", e);
		throw e;
		return null;
	}
};