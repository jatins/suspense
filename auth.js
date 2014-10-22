var users = require('./userList');

exports.isValidUser = function(username, pwd) {
	if(!(username in users))
		return 0;
	if(users[username] != pwd)
		return 0;

	return 1;
};