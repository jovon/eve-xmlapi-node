var http = require('http');
var https = require('https');
var Promise = require('bluebird');
var parseString = require('xml2js').parseString;
var utils = require('./utils'), Error = require('./Error');
var hasOwn = {}.hasOwnProperty;
var EveResource = (function () {
    function EveResource(eve) {
        this.requestParamProcessor = null;
        this._eve = eve;
        this.extend = utils.protoExtend;
        this.method = require('./EveMethod');
        this.path = '';
        this.overrideHost = null;
    }
    EveResource.prototype.createFullPath = function (requestPath, params) {
        if (params)
            return requestPath + '?' + params;
        return requestPath;
    };
    ;
    EveResource.prototype.createDeferred = function (callback) {
        var deferred = Promise.defer();
        if (callback) {
            deferred.promise.then(function (res) {
                setTimeout(function () { callback(null, res); }, 0);
            }, function (err) {
                setTimeout(function () { callback(err, null); }, 0);
            });
        }
        return deferred;
    };
    ;
    EveResource.prototype._timeoutHandler = function (timeout, req, callback) {
        var self = this;
        return function () {
            var timeoutErr = new Error('ETIMEDOUT');
            timeoutErr.code = 'ETIMEDOUT';
            req._isAborted = true;
            req.abort();
            callback.call(self, new Error.EveConnectionError({
                message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
                detail: timeoutErr,
            }), null);
        };
    };
    ;
    EveResource.prototype._responseHandler = function (req, callback) {
        var self = this;
        return function (res) {
            var response = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                response += chunk;
            });
            res.on('error', function (e) {
                callback.call(self, new Error("Error in response handler"));
            });
            res.on('end', function () {
                var headers = res.headers || {};
                parseString(response, function (err, result) {
                    if (err)
                        return callback.call(self, new Error("Error parsing"));
                    try {
                        if (result && result.eveapi && result.eveapi.error) {
                            var errorMessage = result.eveapi.error[0]._;
                            var errorCode = result.eveapi.error[0].$.code;
                            err = new Error.EveAuthenticationError({ message: errorMessage, code: errorCode });
                            callback.call(self, err, null);
                        }
                        else {
                            callback.call(self, null, result);
                        }
                    }
                    catch (e) {
                        return callback.call(self, new Error.EveAPIError({
                            message: 'Invalid XML received from the Eve API',
                            response: response,
                            exception: e,
                            requestId: headers['request-id'],
                        }), null);
                    }
                });
            });
        };
    };
    ;
    EveResource.prototype._errorHandler = function (req, callback) {
        var self = this;
        return function (error) {
            if (req._isAborted) {
                return;
            }
            callback.call(self, new Error.EveConnectionError({
                message: 'An error occurred with our connection to Eve Api',
                detail: error,
            }), null);
        };
    };
    ;
    EveResource.prototype._request = function (method, path, params, options, callback) {
        var self = this, headers;
        this._eve.getClientUserAgent(function (cua) {
            var apiVersion = self._eve.getApiField('version') || '';
            headers = {
                'Accept': 'application/xml',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': options.contentLength,
                'User-Agent': 'EveAPI-node/' + self._eve.getConstant('PACKAGE_VERSION'),
                'EveApi-Version': apiVersion,
                'X-Client-User-Agent': cua
            };
            makeRequest();
        });
        function makeRequest() {
            var timeout = self._eve.getApiField('timeout');
            var host = self.overrideHost || self._eve.getApiField('host');
            var opt = {
                host: host,
                port: self._eve.getApiField('port'),
                path: path,
                method: method,
                agent: self._eve.getApiField('agent'),
                headers: headers,
                keepAlive: true,
                ciphers: 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5',
            };
            var isInsecureConnection = self._eve.getApiField('protocol') === 'http', req = (isInsecureConnection ? http : https).request(opt);
            req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
            req.on('response', self._responseHandler(req, callback));
            req.on('error', self._errorHandler(req, callback));
            req.on('socket', function (socket) {
                socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function () {
                    req.write(params || '');
                    req.end();
                });
            });
        }
    };
    ;
    return EveResource;
})();
;
module.exports = EveResource;
//# sourceMappingURL=EveResource.js.map