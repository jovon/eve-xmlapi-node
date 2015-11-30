var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
module.exports = EveResource.extend({
    fetch: eveMethod({
        method: 'GET',
        path: '/char/SkillQueue.xml.aspx',
        cacheDuration: 360000,
        secured: true
    })
});
//# sourceMappingURL=SkillQueue.js.map