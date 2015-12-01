var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var utils = require('../utils');
var Error = require('../Error');
var SkillQueue = (function (_super) {
    __extends(SkillQueue, _super);
    function SkillQueue(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/char/SkillQueue.xml.aspx',
            cacheDuration: 360000
        });
        this.authParamProcessor = function (self, params, deferred) {
            var eveApiKey = this._eve.getApiKey(params);
            if (params && params.characterID && typeof params === 'object') {
                if (eveApiKey) {
                    eveApiKey.characterID = params.characterID;
                }
                return utils.stringifyRequestData(eveApiKey);
            }
            else if ((typeof params === 'string' && params != '') || typeof params === 'number') {
                if (eveApiKey) {
                    eveApiKey.characterID = params;
                }
                return utils.stringifyRequestData(eveApiKey);
            }
            return deferred.reject(new Error.EveInvalidRequestError({ message: "SkillQueue requires an object with a characterID property, a number or a string." }));
        };
    }
    return SkillQueue;
})(Resource);
module.exports = SkillQueue;
//# sourceMappingURL=SkillQueue.js.map