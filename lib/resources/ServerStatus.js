var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var ServerStatus = (function (_super) {
    __extends(ServerStatus, _super);
    function ServerStatus(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/server/ServerStatus.xml.aspx',
            cacheDuration: 180000
        });
    }
    return ServerStatus;
})(Resource);
module.exports = ServerStatus;
//# sourceMappingURL=ServerStatus.js.map