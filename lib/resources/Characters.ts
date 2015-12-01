import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class Characters extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/account/Characters.xml.aspx',
			cacheDuration: 360000,
		})
		this.authParamProcessor = function(self: any, params: any, deferred: any): string{
			var eveApiKey = this._eve.getApiKey(params)
			if(utils.isKeyHash(eveApiKey)) {
				return utils.stringifyRequestData(eveApiKey)
			} else {			
				return deferred.reject(
						new Error.EveInvalidRequestError(
						{message: "Characters requires an object with a keyID and vCode property."}
						)
					)
			}
		};
	}
	
}
export = Characters