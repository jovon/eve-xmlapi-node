'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
var Error = require('../Error.js')
var utils = require('../utils')

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/eve/CharacterID.xml.aspx',
		cacheDuration: 360000		
	}),
	requestParamProcessor: function(method, params, headers) {
		var result;
		if(params && params.names && typeof params === 'object') {
			if(Array.isArray(params.names)) {
				result = utils.stringifyRequestData({names: params.names.join(',')})
			} else if(params.names && typeof params.names === 'string' && params.names != '') {
				result = utils.stringifyRequestData(params)
			}
		} else if (typeof params === 'string' && params != '') {
			result = utils.stringifyRequestData({names: params})
		} else {
			result = new Error.EveInvalidRequestError("CharacterID requires an object with a names property or a string with the names separated by a comma.")
		}
		return result
	},
})