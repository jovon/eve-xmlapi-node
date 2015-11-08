'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
var Error = require('../Error.js')
var utils = require('../utils')

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/eve/CharacterID.xml.aspx',
		urlParams: ['names'],
		cacheDuration: 60000		
	}),
	requestParamProcessor: function(method, params, headers) {		
		if(params && params != {} && typeof params === 'object') {
			if(params.names && Array.isArray(params.names)) {
				return 'names=' + params.names.join(',')
			} else if(params.names && typeof params.names === 'string' && params.names != '') {
				return utils.stringifyRequestData(params)
			}
		} else if (typeof params === 'string' && params != '') {
			return 'names=' + params
		}		
		return new Error.EveInvalidRequestError("CharacterID requires an object with a names property or a string with the names separated by a comma.")
	},
})