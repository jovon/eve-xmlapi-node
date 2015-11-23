var Cache = (function () {
    function Cache() {
    }
    Cache.prototype.getCurrentTime = function () {
        return (new Date()).getTime();
    };
    return Cache;
})();
Cache.prototype.write;
Cache.prototype.read;
module.exports = Cache;
//# sourceMappingURL=cache.js.map