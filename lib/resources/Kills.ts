import Resource = require('../EveResource');

class Kills extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/map/kills.xml.aspx',
			cacheDuration: 3600000,
		})
	}
}

export = Kills