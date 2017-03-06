/* global require, module */

var API = require('claudia-api-builder'),
	api = new API(),
	tankAI = require('./tank');

module.exports = api;

api.get('/info', function () {
	'use strict';
	return {
		name: 'Rambo',
		owner: 'Henrik'
	};
});
api.post('/command', function (request) {
	'use strict';
	var map = request.body;
	return {
		command: tankAI(map, ['top', 'bottom'])
	};
});
