var EveResource = require('../EveResource');
var eveMethod = EveResource.method;
module.exports = EveResource.extend({
    fetch: eveMethod({
        method: 'GET',
        path: '/Api/CallList.xml.aspx'
    })
});
//# sourceMappingURL=CallList.js.map