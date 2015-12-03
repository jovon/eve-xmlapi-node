import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class Blueprints extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/Blueprints.xml.aspx',
			cacheDuration: 7200000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = Blueprints