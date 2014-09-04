module.exports = {
	Local: {
		dbUrl: 'mongodb://localhost:27017/suspense-beta',
		clientUrl: 'http://localhost:8000'
	},
	Prod: {
		dbUrl: 'mongodb://jatin:latestEPbuzz2014@kahana.mongohq.com:10033/expense_prod',
		clientUrl: 'http://jatins.github.io',
		clientUrl_secure: 'https://jatins.github.io'
	}
};