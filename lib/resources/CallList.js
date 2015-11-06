'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
var utils = require('../utils');

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/Api/CallList.xml.aspx',
	}),
})