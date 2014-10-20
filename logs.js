'use strict';

var mongojs = require('mongojs');
var Config = require('./Config')
var Env = require('./env');

var db = mongojs(Config[Env.Current_Environment]['dbUrl'], ['payments']);

// var ClearLogModel = require('./ClearLogModel');

var comongo = require('co-mongo');
var co = require('co');

exports.details = function *(first, second) {
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

	try {
		var db = yield comongo.connect(Config[Env.Current_Environment].dbUrl);
		var payments = yield db.collection('payments');

		var expenditure = payments.find(expCriteria, expProjection).toArray();
		var consumption = payments.find(consumptionCriteria, conProjection).toArray();
		
		var result = yield [expenditure, consumption];

		expenditure = result[0];
		consumption = result[1];
		
		var obj = {
			consumption: consumption,
			expenditure: expenditure
		};

		yield db.close();
		return obj;
	} catch(e) {
		console.error(e);
		throw e;
	}
};

/*exports.latestDetails = function latestDetails(clearLogModel, callback) {
	if(arguments.length === 3) {
		var first = arguments[0],
			second = arguments[1],
			callback = arguments[2];
		ClearLogModel.find(first, second, function(err, model) {
			latestDetails(model, callback);
		})
	}
	else {


	var first = clearLogModel.first,
		second = clearLogModel.second;
		clearId = clearLogModel._id;

	var expCriteria = {};
	expCriteria['paidBy'] = first;
	expCriteria['paidTo.' + second] = {$gt: 0};
	expCriteria['_id'] = {$gt: clearId};

	var expProjection = {};
	expProjection['paidTo.' + second] = 1;
	expProjection['reason'] = 1;

	var consumptionCriteria = {};
	consumptionCriteria['paidBy'] = second;
	consumptionCriteria['paidTo.' + first] = {$gt: 0};
	consumptionCriteria['_id'] = {$gt: clearId};

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
	
}*/

