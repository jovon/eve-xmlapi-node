import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class CharAccountBalance extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/AccountBalance.xml.aspx',
			cacheDuration: 360000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = CharAccountBalance