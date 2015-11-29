var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = require('../EveResource');
var CallList = (function (_super) {
    __extends(CallList, _super);
    function CallList(eve) {
        _super.call(this, eve);
        this.fetch = this.method({
            method: 'GET',
            path: '/Api/CallList.xml.aspx',
        });
    }
    return CallList;
})(Resource);
module.exports = CallList;
//# sourceMappingURL=CallList.js.map