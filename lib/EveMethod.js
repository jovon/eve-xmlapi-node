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
      urlParams = spec.urlParams || [],
      duration = spec.cacheDuration || 3600000;  // sets default duration at 1 hour
  
  return function() {
    var self = this,
        args = [].slice.call(arguments),
        cache = self._eve.getCache(),       
        callback = typeof args[args.length - 1] == 'function' && args.pop(),
        deferred = this.createDeferred(callback),
        urlData = this.createUrlData(),
        options = {},
        requestPath = '',
        cacheKey = '',
        verifiedParams = verifyParams(urlParams, args, urlData, deferred),    
        requestParams = utils.formatRequestParams(self, 
                                                  requestMethod, 
                                                  verifiedParams, 
                                                  spec.headers, 
                                                  deferred);
                                                
    options = {headers: spec.headers, contentLength: contentLength(requestParams)};                                                 
    requestPath = this.createFullPath(commandPath, requestParams)
    cacheKey = requestPath
    
    function requestCallback(err, response, isCached) {
      var resp;
      if (err) {
        deferred.reject(err);
      } else {
        resp = spec.transformResponseData ? spec.transformResponseData(response) : response;
        if(isCached) {
          console.info('%s: Cached Until %s UTC', cacheKey, resp.eveapi.cachedUntil)
          deferred.resolve(resp);          
        }else{
          cache.write(cacheKey, JSON.stringify(resp), duration, function(err){
            if(err) deferred.reject(err);
            deferred.resolve(resp);
          })
        }
      }
    };
    
    cache.read(cacheKey, function(err, data) {
      if(err) return requestCallback(err)
      if(typeof data === 'string') return requestCallback(null, JSON.parse(data), true)      
      
      self._request(requestMethod, requestPath, requestParams, options, requestCallback);
  
      return deferred.promise;
    })
  };
};

function contentLength(requestParams) {
  return requestParams ? requestParams.length : 0
}

function verifyParams(urlParams, args, urlData, deferred) {
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