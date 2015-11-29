import Resource = require('../EveResource');

class Characters extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/account/Characters.xml.aspx',
			cacheDuration: 360000,
			secured: true,  //requires a keyID and vCode query parameter if true
		})
	}
	
}
export = Chara