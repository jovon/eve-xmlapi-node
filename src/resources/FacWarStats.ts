import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class FacWarStats extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/FacWarStats.xml.aspx',
			cacheDuration: 3600000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = FacWarStats