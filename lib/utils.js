var qs = require('qs');
var _ = require('lodash');
var error = require('./Error');
var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;
var utils = {
    isKeyHash: function (o) {
        return _.isPlainObject(o)
            && (o.hasOwnProperty('keyID') || o.hasOwnProperty('keyid') || o.hasOwnProperty('keyId'))
            && (o.hasOwnProperty('vCode') || o.hasOwnProperty('vcode'));
    },
    isObject: function (o) {
        return _.isPlainObject(o);
    },
    formatRequestParams: function (self, data, deferred) {
        var requestParams = self.requestParamProcessor(data, deferred);
        return utils.stringifyRequestData(requestParams);
    },
    keyVCodeProcessor: function (self, params, deferred) {
        var eveApiKey = self._eve.getApiKey(params);
        if (eveApiKey) {
            return eveApiKey;
        }
        deferred.reject(new error.EveInvalidRequestError({ message: "Requires an object with a keyID and vCode property." }));
    },
    keyVCodeCharIDProcessor: function (self, params, deferred) {
        var eveApiKey = utils.keyVCodeProcessor(self, params, deferred);
        if (params && params.characterID && typeof params === 'object') {
            if (eveApiKey) {
                eveApiKey.characterID = params.characterID;
            }
            return eveApiKey;
        }
        else if ((typeof params === 'string' && params != '') || typeof params === 'number') {
            if (eveApiKey) {
                eveApiKey.characterID = params;
            }
            return eveApiKey;
        }
        deferred.reject(new error.EveInvalidRequestError({ message: "Requires characterID property." }));
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
module.exports = utils;
//# sourceMappingURL=utils.js.map