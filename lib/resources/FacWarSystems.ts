import Resource = require('../EveResource');

class FacWarSystems extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/map/FacWarSystems.xml.aspx',
			cacheDuration: 3600000,
		})
	}
}

export = FacWarSystems