var _ = require('lodash');
var utils = require('./utils');
var Error = require('./Error');
function eveMethod(spec) {
    var commandPath = spec.path, requestMethod = (spec.method || 'GET').toUpperCase(), duration = spec.cacheDuration || 3600000, securedResource = spec.secured;
    return function () {
        var self = this, args = [].slice.call(arguments), cache = self._eve.getCache(), callback = typeof args[args.length - 1] == 'function' && args.pop(), deferred = this.createDeferred(callback), options = {}, requestPath = '', cacheKey = '', requestParams = '', keyString = '';
        if (securedResource) {
            keyString = verifyKeyObj(self, args[0], deferred);
        }
        else {
            requestParams = utils.formatRequestParams(self, requestMethod, args[0], deferred);
        }
        var apiVersion = self._eve.getApiField('version') || '';
        var headers = {
            'Accept': 'application/xml',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contentLength(keyString),
            'User-Agent': self._eve.getUserAgent() || '',
            'Client-Version': apiVersion,
            'X-Client-User-Agent': 'EveAPI-node/' + self._eve.PACKAGE_VERSION + ' (jvnpackard@gmail.com)'
        };
        requestPath = this.createFullPath(commandPath, requestParams);
        cacheKey = (this.overrideHost || this._eve.getApiField('host')) + requestPath;
        function requestCallback(err, response, isCached) {
            var resp, res;
            if (err) {
                deferred.reject(err);
            }
            else {
                if (isCached) {
                    return deferred.resolve(response);
                }
                else {
                    res = self._eve.transformAllResponses ? self._eve.transformAllResponses(response) : response;
                    resp = self.transformResponseData ? self.transformResponseData(res) : res;
                    cache.write(cacheKey, JSON.stringify(resp), duration, function (err, r) {
                        if (err)
                            return deferred.reject(err);
                        return deferred.resolve(resp);
                    });
                }
            }
        }
        ;
        cache.read(cacheKey, function (err, data) {
            if (err)
                return requestCallback(err, null, false);
            if (data && typeof data === 'string')
                return requestCallback(null, JSON.parse(data), true);
            self._request(requestMethod, requestPath, keyString, headers, requestCallback);
            return deferred.promise;
        });
    };
}
;
function contentLength(keyStr) {
    return keyStr ? keyStr.length : 0;
}
function verifyKeyObj(self, arg, deferred) {
    var params = {};
    var eveApiKeyObj = self._eve.getApiKey(arg);
    if (utils.isKeyHash(eveApiKeyObj)) {
        if (utils.isObject(arg))
            _.assign(params, eveApiKeyObj, arg);
    }
    else {
        return deferred.reject(new Error.EveInvalidRequestError("Missing keyID or vCode"));
    }
    return utils.stringifyRequestData(params || arg);
}
module.exports = eveMethod;
//# sourceMappingURL=EveMethod.js.map