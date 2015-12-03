import qs = require('qs');
import _ = require('lodash');
import globals = require('./globals')
import Promise = require('bluebird')
import error = require('./Error')
var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;

export = utils

var utils = {

	isKeyHash: function(o: any) {
		return _.isPlainObject(o)
			&& (o.hasOwnProperty('keyID') || o.hasOwnProperty('keyid') || o.hasOwnProperty('keyId'))
			&& (o.hasOwnProperty('vCode') || o.hasOwnProperty('vcode'))
	},

	isObject: function(o: any) {
		return _.isPlainObject(o);
	},
  
     
	// },
  
	/* 
	* A param processor for resources than require just the keyID and vCode for authentication
	*/
	keyVCodeProcessor(self: any, params: globals.Params, deferred: Promise.Resolver<Error>): globals.Params {
		var eveApiKey: globals.EveKey = self._eve.getApiKey(params)
		if (eveApiKey) {
			return eveApiKey
		}
		deferred.reject(
			new error.EveInvalidRequestError(
				{ message: "Requires an object with a keyID and vCode property." }
			)
        )
	},
  
	/* 
	* A param processor for resources than require just the keyID, vCode, and CharacterID for authentication
	*/
	keyVCodeCharIDProcessor(self: any, params: any, deferred: Promise.Resolver<Error>): globals.Params {
		var eveApiKey: globals.Params = utils.keyVCodeProcessor(self, params, deferred)
		if (params && params.characterID && typeof params === 'object') {
			if (eveApiKey) {
				eveApiKey.characterID = params.characterID
			}
			return eveApiKey
		} else if ((typeof params === 'string' && params != '') || typeof params === 'number') {
			if (eveApiKey) {
				eveApiKey.characterID = params
			}
			return eveApiKey
		}
		deferred.reject(
			new error.EveInvalidRequestError({ message: "Requires characterID property." })
        )

	},
    
  
	/**
	 * Stringifies an Object, accommodating nested objects
	 * (forming the conventional key 'parent[child]=value')
	 */
	stringifyRequestData: function(data: any): string {
		return qs.stringify(data, { arrayFormat: 'brackets' });
	},

  
	/**
	 * Return the data argument from a list of arguments.
	 * Removes the keyid and vcode from the arguments then
	 * returns the rest of the parameters.
	 */
	getDataFromArgs: function(args: any) {
		var arg = args[0];
		if (utils.isKeyHash(arg)) {
			delete arg['keyID']
			delete arg['vCode']
		}
		return arg
	},

	/**
	 * Return the options hash from a list of arguments
	 */
	getKeyFromArgs: function(args: any): globals.EveKey {
		var key: globals.EveKey = {
			keyID: '',
			vCode: '',
		}

		var arg = args[0];
		if (utils.isKeyHash(arg)) {
			key.keyID = arg.keyID
			key.vCode = arg.vCode
		}
		return key;
	},

	/**
	 * Provide simple "Class" extension mechanism
	 */
	protoExtend: function(sub: any) {
		var Super = this;
		var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function() {
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
	},

};