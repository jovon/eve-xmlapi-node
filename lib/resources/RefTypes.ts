import Resource = require('../EveResource');

class RefTypes extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/eve/RefTypes.xml.aspx',
			cacheDuration: 85400000,
		})
	}
}

export = RefTypes