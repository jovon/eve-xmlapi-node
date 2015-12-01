var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var utils = require('../utils');
var Error = require('../Error');
var Characters = (function (_super) {
    __extends(Characters, _super);
    function Characters(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/account/Characters.xml.aspx',
            cacheDuration: 360000
        });
        this.authParamProcessor = function (self, params, deferred) {
            var eveApiKey = this._eve.getApiKey(params);
            if (utils.isKeyHash(eveApiKey)) {
                return utils.stringifyRequestData(eveApiKey);
            }
            else {
                return deferred.reject(new Error.EveInvalidRequestError({ message: "Characters requires an object with a keyID and vCode property." }));
            }
        };
    }
    return Characters;
})(Resource);
module.exports = Characters;
//# sourceMappingURL=Characters.js.map