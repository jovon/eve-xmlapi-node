import EveResource = require('../EveResource');
var eveMethod = EveResource.method;

module.exports = EveResource.extend({
	fetch: eveMethod({
		method: 'GET',
		path: '/char/SkillQueue.xml.aspx',
		cacheDuration: 360000,
		secured: true,  //requires a keyID and vCode query parameter if true
	}),
	
})