import Resource = require('../EveResource');

class ErrorList extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/eve/ErrorList.xml.aspx',
			cacheDuration: 3600000,
		})
	}
}

export = ErrorList