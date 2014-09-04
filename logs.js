var mongojs = require('mongojs');
var Config = require('./Config')
var Env = require('./env');

var db = mongojs(Config[Env.Current_Environment]['dbUrl'], ['payments']);

exports.details = function(first, second, callback) {
	var expCriteria = {};
	expCriteria['paidBy'] = first;
	expCriteria['paidTo.' + second] = {$gt: 0};

	var expProjection = {};
	expProjection['paidTo.' + second] = 1;
	expProjection['reason'] = 1;


	var consumptionCriteria = {};
	consumptionCriteria['paidBy'] = second;
	consumptionCriteria['paidTo.' + first] = {$gt: 0};


	var conProjection = {};
	conProjection['paidTo.' + first] = 1;
	conProjection['reason'] = 1;



	db.payments.find(expCriteria, expProjection,
		function(err_exp, expenditure) {
			if(err_exp) {
				console.log("[ERROR]: could not get expenditure");
				callback(err_exp, null)
			} else {
				db.payments.find(consumptionCriteria, conProjection,
					function(err_con, consumption) {
						if(err_con) {
							callback(err_con, null);
						}
						else {
							var obj = {
								consumption: consumption,
								expenditure: expenditure
							};
							callback(err_con, obj)
						}
					}
				)
			}
		}
	);
}