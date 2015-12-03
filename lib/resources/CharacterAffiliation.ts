import Resource = require('../EveResource');
import Error = require('../Error')
import utils = require('../utils')
import globals = require('../../globals')

class CharacterAffiliation extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch =  this.method({
			method: 'GET',
			path: '/eve/CharacterAffiliation.xml.aspx',
			cacheDuration: 3600000		
		})
		this.requestParamProcessor = function(params: globals.Params, deferred: any): any {
			if(params && params.ids && typeof params === 'object') {
				if(Array.isArray(params.ids)) {
					return {ids: params.ids.join(',')}
				} else if(params.ids && typeof params.ids === 'string' && params.names != '') {
					return params
				}
			} else if (typeof params === 'string' && params != '') {
				return {names: params}
			} 
			deferred.reject(new Error.EveInvalidRequestError({message: "CharacterAffiliation requires an object with a names property or a string with the names separated by a comma."}))	
		};
	};
	
}

export = CharacterAffiliation