import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class CorpAccountBalance extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/corp/AccountBalance.xml.aspx',
			cacheDuration: 900000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = CorpAccountBalance