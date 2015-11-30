import Resource = require('../EveResource');

class SkillQueue extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/SkillQueue.xml.aspx',
			cacheDuration: 360000,
			secured: true,  //requires a keyID and vCode query parameter if true
		})
	}
}
export = SkillQueue