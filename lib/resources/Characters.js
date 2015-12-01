var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var utils = require('../utils');
var Characters = (function (_super) {
    __extends(Characters, _super);
    function Characters(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/account/Characters.xml.aspx',
            cacheDuration: 3600000
        });
        this.authParamProcessor = utils.keyVCodeProcessor;
    }
    return Characters;
})(Resource);
module.exports = Characters;
//# sourceMappingURL=Characters.js.map