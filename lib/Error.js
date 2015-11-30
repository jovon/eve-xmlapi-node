'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require('./utils');
var _Error;
(function (_Error) {
    var EveError = (function (_super) {
        __extends(EveError, _super);
        function EveError(raw) {
            _super.call(this);
            this.type = this.type || 'Generic';
            this.stack = (new Error(raw.message)).stack;
            this.rawType = raw.type;
            this.code = raw.code;
            this.param = raw.param;
            this.message = raw.message || 'Unknown';
            this.detail = raw.detail;
            this.raw = raw;
            this.requestId = raw.requestId;
            this.statusCode = raw.statusCode;
        }
        return EveError;
    })(Error);
    _Error.EveError = EveError;
    ;
    var EveInvalidRequestError = (function (_super) {
        __extends(EveInvalidRequestError, _super);
        function EveInvalidRequestError(raw) {
            _super.call(this, raw);
            this.type = 'EveInvalidRequestError';
        }
        return EveInvalidRequestError;
    })(EveError);
    _Error.EveInvalidRequestError = EveInvalidRequestError;
    var EveAPIError = (function (_super) {
        __extends(EveAPIError, _super);
        function EveAPIError(raw) {
            _super.call(this, raw);
            this.type = 'EveAPIError';
        }
        return EveAPIError;
    })(EveError);
    _Error.EveAPIError = EveAPIError;
})(_Error || (_Error = {}));
module.exports = _Error;
//# sourceMappingURL=Error.js.map