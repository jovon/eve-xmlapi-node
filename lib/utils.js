var qs = require('qs');
var _ = require('lodash');
var error = require('./Error');
var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;
var utils = module.exports = {
    isKeyHash: function (o) {
        return _.isPlainObject(o) && o.hasOwnProperty('keyID') && o.hasOwnProperty('vCode');
    },
    isObject: function (o) {
        return _.isPlainObject(o);
    },
    formatRequestParams: function (self, method, data, deferred) {
        var requestParams;
        if (self.requestParamProcessor) {
            requestParams = self.requestParamProcessor(method, data);
            if (requestParams instanceof Error) {
                return deferred.reject(requestParams);
            }
        }
        else {
            return this.stringifyRequestData(data || {});
        }
        return requestParams;
    },
    keyObjToStr: function (self, arg, deferred) {
        var params = {};
        var eveApiKeyObj = self._eve.getApiKey(arg);
        if (this.isKeyHash(eveApiKeyObj)) {
            if (this.isObject(arg))
                _.assign(params, eveApiKeyObj, arg);
        }
        else {
            return deferred.reject(new error.EveInvalidRequestError("Missing keyID or vCode"));
        }
        return this.stringifyRequestData(params || arg);
    },
    stringifyRequestData: function (data) {
        return qs.stringify(data, { arrayFormat: 'brackets' });
    },
    getDataFromArgs: function (args) {
        var arg = args[0];
        if (utils.isKeyHash(arg)) {
            delete arg['keyID'];
            delete arg['vCode'];
        }
        return arg;
    },
    getKeyFromArgs: function (args) {
        var key = {
            keyID: '',
            vCode: ''
        };
        var arg = args[0];
        if (utils.isKeyHash(arg)) {
            key.keyID = arg.keyID;
            key.vCode = arg.vCode;
        }
        return key;
    },
    protoExtend: function (sub) {
        var Super = this;
        var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function () {
            Super.apply(this, arguments);
        };
        Constructor.prototype = Object.create(Super.prototype);
        for (var i in sub) {
            if (hasOwn.call(sub, i)) {
                Constructor.prototype[i] = sub[i];
            }
        }
        for (i in Super) {
            if (hasOwn.call(Super, i)) {
                Constructor[i] = Super[i];
            }
        }
        return Constructor;
    }
};
//# sourceMappingURL=utils.js.map