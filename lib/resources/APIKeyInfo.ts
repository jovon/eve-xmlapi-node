import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class APIKeyInfo extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/account/APIKeyInfo.xml.aspx',
			cacheDuration: 300000,
		})
		this.authParamProcessor = utils.keyVCodeProcessor
	}	
}
export = APIKeyInfo