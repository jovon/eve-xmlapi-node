'use strict';

var EveResource = require('../EveResource');
var eveMethod = EveResource.method;

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/eve/CharacterID.xml.aspx',		
	}),
	requestDataProcessor: function(method, data, headers) {
		if(data && typeof data === 'object') {
			if(data.names && Array.isArray(data.names)) {
				return data.names.join(',')
			}
			return data.names
		} else if (typeof data === 'string' && data != '') {
			return 'names=' + data
		}		
		return new Error("InvalidRequestError","Error: CharacterID needs a string of names separated by commas\
		or an object with a property names containing a string")
	},
})