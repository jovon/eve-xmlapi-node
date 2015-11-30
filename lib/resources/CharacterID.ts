
import Resource = require('../EveResource');
var Error = require('../Error.js')
var utils = require('../utils')

class CharacterID extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch =  this.method({
			method: 'GET',
			path: '/eve/CharacterID.xml.aspx',
			cacheDuration: 360000		
		})
		this.requestParamProcessor = function(method: string, params: any) {
			if(params && params.names && typeof params === 'object') {
				if(Array.isArray(params.names)) {
					return utils.stringifyRequestData({names: params.names.join(',')})
				} else if(params.names && typeof params.names === 'string' && params.names != '') {
					return utils.stringifyRequestData(params)
				}
			} else if (typeof params === 'string' && params != '') {
				return utils.stringifyRequestData({names: params})
			} else {
				return new Error.EveInvalidRequestError("CharacterID requires an object with a names property or a string with the names separated by a comma.")
			}
		};
	};
	
}

export = CharacterID