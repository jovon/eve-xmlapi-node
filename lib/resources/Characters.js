var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
module.exports = EveResource.extend({
    fetch: eveMethod({
        method: 'GET',
        path: '/account/Characters.xml.aspx',
        cacheDuration: 360000,
        secured: true
    })
});
//# sourceMappingURL=Characters.js.map