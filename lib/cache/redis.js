var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Cache = require('./cache');
var redis = require('redis');
var RedisCache = (function (_super) {
    __extends(RedisCache, _super);
    function RedisCache(options) {
        _super.call(this);
        this.write = function (key, value, duration, cb) {
            var expireTime = this.getCurrentTime() + duration;
            var data = { expireTime: expireTime, data: value };
            this._client.hmset(key, data, function (err, resp) {
                if (err)
                    return cb.call(this, err);
                cb.call(this, null, resp);
            });
        };
        this.read = function (key, cb) {
            var self = this;
            this._client.hgetall(key, function (err, resp) {
                if (err)
                    return cb.call(self, err);
                if (!resp)
                    return cb.call(self, null, null);
                var currentTime = self.getCurrentTime();
                if (currentTime >= parseInt(resp.expireTime)) {
                    return cb.call(self, null, null);
                }
                else {
                    cb.call(self, null, resp.data);
                }
            });
        };
        options = options || {};
        this._port = options.port || 6379;
        this._host = options.host || '127.0.0.1';
        this._client = options.client || redis.createClient(this._port, this._host);
    }
    RedisCache.prototype.clear = function (cb) {
        if (!cb)
            cb = function () { };
        this._client.flushdb();
        cb();
    };
    return RedisCache;
})(Cache);
module.exports = RedisCache;
//# sourceMappingURL=redis.js.map