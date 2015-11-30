import Resource = require('../EveResource');

class CallList extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/Api/CallList.xml.aspx',
		})
	}
}

export = CallList