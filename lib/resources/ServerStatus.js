'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/server/ServerStatus.xml.aspx',
		cacheDuration: 180000,
	}),
})