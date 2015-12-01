var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var utils = require('../utils');
var SkillQueue = (function (_super) {
    __extends(SkillQueue, _super);
    function SkillQueue(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/char/SkillQueue.xml.aspx',
            cacheDuration: 360000
        });
        this.authParamProcessor = utils.keyVCodeCharIDProcessor;
    }
    return SkillQueue;
})(Resource);
module.exports = SkillQueue;
//# sourceMappingURL=SkillQueue.js.map