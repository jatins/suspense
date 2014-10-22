/**
 * @interface
 */
function Cache() {}

Cache.prototype.read = function(key) {};
Cache.prototype.write = function(key, value) {};
Cache.prototype.update = function(key, value) {};
Cache.prototype.invalidate = function() {};

module.exports = Cache;