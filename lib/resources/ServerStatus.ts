import Resource = require('../EveResource');

class ServerStatus extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/server/ServerStatus.xml.aspx',
			cacheDuration: 180000,
		})		
	}
}

export = ServerStatus