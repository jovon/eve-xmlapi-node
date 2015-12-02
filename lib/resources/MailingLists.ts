import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class MailingLists extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/MailingLists.xml.aspx',
			cacheDuration: 21600000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = MailingLists