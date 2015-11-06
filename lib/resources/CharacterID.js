'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
var Error = require('../Error.js')
var utils = require('../utils')

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/eve/CharacterID.xml.aspx',		
	}),
	requestParamProcessor: function(method, data, headers) {
		if(data && data != {} && typeof data === 'object') {
			if(data.names && Array.isArray(data.names)) {
				return 'names=' + data.names.join(',')
			} else if(data.names && typeof data.names === 'string' && data.names != '') {
				return utils.stringifyRequestData(data)
			}
		} else if (typeof data === 'string' && data != '') {
			return 'names=' + data
		}
		return new Error("InvalidRequestError","Error: CharacterID needs a string of names separated by commas or an object with a property names containing a string")
	},
})