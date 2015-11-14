'use strict';

var qs = require('qs');
var _ = require('lodash');

var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;

var utils = module.exports = {

  isKeyHash: function(o) {
    return _.isPlainObject(o) && o.hasOwnProperty('keyID') && o.hasOwnProperty('vCode')
  },

  isObject: function(o) {
    return _.isPlainObject(o);
  },
  
  formatRequestParams(self, method, data, headers, deferred) {
    var requestParams;    
    if (self.requestParamProcessor) {
      requestParams = self.requestParamProcessor(method, data, headers);      
      if(requestParams instanceof Error) {
        return deferred.reject(requestParams)
      }      
    } else {
      requestParams = this.stringifyRequestData(data || {});
    }
    return requestParams    
  },

  /**
   * Stringifies an Object, accommodating nested objects
   * (forming the conventional key 'parent[child]=value')
   */
  stringifyRequestData: function(data) {
    return qs.stringify(data, {arrayFormat: 'brackets'});
  },

  /**
   * https://gist.github.com/padolsey/6008842
   * Outputs a new function with interpolated object property values.
   * Use like so:
   *   var fn = makeURLInterpolator('some/url/{param1}/{param2}');
   *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
   */
  makeURLInterpolator: (function() {
    var rc = {
      '\n': '\\n', '\"': '\\\"',
      '\u2028': '\\u2028', '\u2029': '\\u2029',
    };
    return function makeURLInterpolator(str) {
      return new Function(
        'o',
        'return "' + (
          str
          .replace(/["\n\r\u2028\u2029]/g, function($0) {
            return rc[$0];
          })
          .replace(/\{([\s\S]+?)\}/g, '" + encodeURIComponent(o["$1"]) + "')
        ) + '";'
      );
    };
  }()),

  /**
   * Return the data argument from a list of arguments.
   * Removes the keyid and vcode from the arguments then
   * returns the rest of the parameters.
   */
  getDataFromArgs: function(args) {
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
  getKeyFromArgs: function(args) {
    var key = {
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
  protoExtend: function(sub) {
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