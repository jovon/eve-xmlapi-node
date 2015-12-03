import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../../globals')

class CharacterInfo extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/eve/CharacterInfo.xml.aspx',
			cacheDuration: 3600000,			
		})
		this.authParamProcessor = function (self: any, params: globals.Params, deferred: any) {
			var results: globals.Params = self._eve.getApiKey(params) || {}
			if(params && params.characterID && typeof params === 'object') {
				results.characterID = params.characterID
				return results
			} else {
				deferred.reject(new Error.EveInvalidRequestError({message: "CharacterInfo requires a characterID"}))
			}
		}
	}
}
export = CharacterInfo