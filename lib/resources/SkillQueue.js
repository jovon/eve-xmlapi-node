'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
var Error = require('../Error.js')
var utils = require('../utils')

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/char/SkillQueue.xml.aspx',
		cacheDuration: 360000,
		secured: true,  //requires a keyID and vCode query parameter if true
	}),
	
})