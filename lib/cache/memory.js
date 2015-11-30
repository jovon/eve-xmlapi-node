var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Cache = require('./cache');
var MemoryCache = (function (_super) {
    __extends(MemoryCache, _super);
    function MemoryCache() {
        _super.call(this);
        this._cache = {};
    }
    ;
    MemoryCache.prototype.getCurrentTime = function () {
        return _super.prototype.getCurrentTime.call(this);
    };
    return MemoryCache;
})(Cache);
MemoryCache.prototype.write = function write(key, value, duration, cb) {
    var expireTime = this.getCurrentTime() + duration;
    this._cache[key] = {
        value: value,
        expireTime: expireTime
    };
    cb(null);
};
MemoryCache.prototype.read = function read(key, cb) {
    var value;
    if (this._cache[key] && (this.getCurrentTime() < this._cache[key].expireTime)) {
        value = this._cache[key].value;
    }
    cb(null, value);
};
module.exports = MemoryCache;
//# sourceMappingURL=memory.js.map