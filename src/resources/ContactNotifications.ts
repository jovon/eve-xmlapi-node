import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')

class ContactNotifications extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/ContactNotifications.xml.aspx',
			cacheDuration: 900000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
	}
}
export = ContactNotifications