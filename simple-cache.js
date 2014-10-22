var Graph = require('graph').Graph;
var assert = require('assert');

var Cache = require('./Cache');

/**
 * 
 * @param {string} first - first person	
 * @param {string} second - second person
 * @constructor
 */
function LogKey(first, second) {
	this.first	= first;
	this.second = second;
}

/**
 * Log Cache Value type
 * @param {array | LogValue} consumption
 * @param {array} expenditure
 */
function LogValue(consumption, expenditure) {
    if(consumption instanceof LogValue) {
    	if(expenditure) console.log("[DEBUG: INVALID STATE] HOW IS IT POSSIBLE?");
        var logValue = consumption;
        return new LogValue(logValue.consumption, logValue.expenditure);
    }
	this.consumption = consumption;
	this.expenditure = expenditure;
}

LogValue.prototype.inverted = function() {
    var consumption = this.consumption,
        expenditure = this.expenditure;

    return new LogValue(expenditure, consumption);
}

/**
 * @constructor
 * @implements {Cache}
 */
function LogCache() {
    //private variables
    var graph = new Graph();

    /**
     * check if key exists in cache
     * @param  {LogKey} key
     * @return {boolean}
     */
    this.exists = function(key) {
    	var first = key.first,
           second = key.second;

    	return graph.has(first,second)
    };


    /**
     * 
     * @param  {LogKey} key
     * @return {LogValue}
     */
    this.read = function(key) {
        var first = key.first,
           second = key.second;

        console.log("Reading from cache...");
        if(graph.has(first, second)) {
            return new LogValue(graph.get(first, second));
        } else if(graph.has(second, first)){
            return graph.get(second, first).inverted();
        } else {
            console.log("[INFO]: log for ", key.first, " and ", key.second, " does not exist in cache");
            return null;
        }
    };

    /**
     * 
     * @param  {LogKey} key
     * @param  {LogValue} value
     */
    this.write = function(key, value) {
        var self = this;
        
        console.log("Writing to cache for", key.first, " and ", key.second,  " :: ",  value);
    	var first = key.first,
           	second = key.second;
        if(graph.has(first, second) || graph.has(second, first)) {
            self.invalidate();
        	console.log("[DEBUG]: Invalid state. You shouldn't really be writing since the value exists, use update instead");
        }
        graph.dir(first, second, value);
    };

    /**
     * 
     * @param  {LogKey} key
     * @param  {LogValue} value
     */
    this.update = function (key, value) {
        var self = this;
    	var first = key.first,
           	second = key.second;


        var exists = graph.has(first, second),
        	reverseExists = graph.has(second, first);
        if(!exists && !reverseExists) {
        	console.log("[INFO]: Can't update since the value does not exist. Using write() instead");
	        this.write(key, value);
        }

        if(exists)
	        graph.dir(first, second, value);
        else if(reverseExists) {
        	graph.dir(second, first, value.inverted());
        }

        if(exists && reverseExists) {
        	console.log("[DEBUG: INVALID STATE]")
            self.invalidate();
        }
    };

    this.invalidate = function() {
        console.log("[INFO]: Invalidating the log Cache");
    	graph = new Graph();
    }
}


var logCacheSingleton = (function () {
    /**
     * @type {LogCache}
     */
	var instance; 

    /**
     *
     * @return {LogCache}
     */
	function init() {
		var logCache = new LogCache();
		return logCache;
	};
 
	return {
		instance: function () {
			if ( !instance ) {
				instance = init();
		  	}
			return instance;
		}
	};
 
})();

exports.LogKey = LogKey;
exports.LogValue = LogValue;
exports.instance = logCacheSingleton.instance();




