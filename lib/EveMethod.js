'use strict';

var _ = require('lodash');
var path = require('path');
var utils = require('./utils');
var OPTIONAL_REGEX = /^optional!/;

/**
 * Create an API method from the declared spec.
 *
 * @param [spec.method='GET'] Request Method (POST, GET, DELETE, PUT)
 * @param [spec.path=''] Path to be appended to the API BASE_PATH, joined with
 *  the instance's path (e.g. 'charges' or 'customers')
 * @param [spec.required=[]] Array of required arguments in the order that they
 *  must be passed by the consumer of the API. Subsequent optional arguments are
 *  optionally passed through a hash (Object) as the penultimate argument
 *  (preceeding the also-optional callback argument
 */
function eveMethod(spec) {
  var commandPath = spec.path,
      requestMethod = (spec.method || 'GET').toUpperCase(),
      duration = spec.cacheDuration || 3600000;  // sets default duration at 1 hour
  
  return function() {
    var self = this,
        args = [].slice.call(arguments),
        cache = self._eve.getCache(),       
        callback = typeof args[args.length - 1] == 'function' && args.pop(),
        deferred = this.createDeferred(callback),
        options = {},
        requestPath = '',
        cacheKey = '',        
        requestParams = utils.formatRequestParams(self, 
                                                  requestMethod, 
                                                  args[0], 
                                                  spec.headers, 
                                                  deferred);
                                                
    options = {headers: spec.headers, contentLength: contentLength(requestParams)};                                                 
    requestPath = this.createFullPath(commandPath, requestParams)
    
    cacheKey = (this.overrideHost || this._eve.getApiField('host')) + requestPath
    
    function requestCallback(err, response, isCached) {
      var resp, res;
      if (err) {
        deferred.reject(err);
      } else {              
        if(isCached) {          
          return deferred.resolve(response);
        }else{
          res = self._eve.transformAllResponses ? self._eve.transformAllResponses(response) :response      
          resp = self.transformResponseData ? self.transformResponseData(res) : res;
          cache.write(cacheKey, JSON.stringify(resp), duration, function(err, r){
            if(err) deferred.reject(err);
            return deferred.resolve(resp);
          })
        }        
      }
    };
    
    cache.read(cacheKey, function(err, data) {      
      if(err) return requestCallback(err)      
      if(data && typeof data === 'string') return requestCallback(null, JSON.parse(data), true)      
      
      self._request(requestMethod, requestPath, requestParams, options, requestCallback);
  
      return deferred.promise;
    })
  };
};

function contentLength(requestParams) {
  return requestParams ? requestParams.length : 0
}

/*
* Compares the params specified in the resource with the supplied params.
*
* @param urlParams: Array of strings representing names of params
* @param args:  Array of supplied params
*/
function verifyParams(urlParams, args, deferred) {
  var urlData = {}
  
  for (var i = 0, l = urlParams.length; i < l; ++i) {
      var arg = args[0];
      var param = urlParams[i];

      var isOptional = OPTIONAL_REGEX.test(param);
      param = param.replace(OPTIONAL_REGEX, '');

      if (!arg) {
        if (isOptional) {
          urlData[param] = '';
          continue;
        }
        deferred.reject(new Error('Required argument "' + urlParams[i] + '", but I got: ' + arg));
      }

      urlData[param] = args.shift();
    }        
        
    if (args.length) {
      deferred.reject(new Error(
        'Unknown arguments (' + args + '). Did you mean to pass an options object? '
      ));
    }
    return urlData
}

module.exports = eveMethod;