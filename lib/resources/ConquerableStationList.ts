import Resource = require('../EveResource');

class ConquerableStationList extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/eve/ConquerableStationList.xml.aspx',
		})
	}
}

export = ConquerableStationList