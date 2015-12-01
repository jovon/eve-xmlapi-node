import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class SkillQueue extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/SkillQueue.xml.aspx',
			cacheDuration: 360000,			
		})
		this.authParamProcessor = function(self: any, params: any, deferred: any): string{
			var eveApiKey = this._eve.getApiKey(params)
			if(params && params.characterID && typeof params === 'object') {
				if(eveApiKey) {
					eveApiKey.characterID = params.characterID
				}
				return utils.stringifyRequestData(eveApiKey)
			} else if ((typeof params === 'string' && params != '') || typeof params === 'number') {
				if(eveApiKey) {
					eveApiKey.characterID = params
				}
				return utils.stringifyRequestData(eveApiKey)
			} 
			return deferred.reject(
					new Error.EveInvalidRequestError(
					{message: "SkillQueue requires an object with a characterID property, a number or a string."}
					)
				)
			
		};
	}
}
export = SkillQueue