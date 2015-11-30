var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var Error = require('../Error.js');
var utils = require('../utils');
var CharacterID = (function (_super) {
    __extends(CharacterID, _super);
    function CharacterID(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/eve/CharacterID.xml.aspx',
            cacheDuration: 360000
        });
        this.requestParamProcessor = function (method, params) {
            if (params && params.names && typeof params === 'object') {
                if (Array.isArray(params.names)) {
                    return utils.stringifyRequestData({ names: params.names.join(',') });
                }
                else if (params.names && typeof params.names === 'string' && params.names != '') {
                    return utils.stringifyRequestData(params);
                }
            }
            else if (typeof params === 'string' && params != '') {
                return utils.stringifyRequestData({ names: params });
            }
            else {
                return new Error.EveInvalidRequestError("CharacterID requires an object with a names property or a string with the names separated by a comma.");
            }
        };
    }
    ;
    return CharacterID;
})(Resource);
module.exports = CharacterID;
//# sourceMappingURL=CharacterID.js.map