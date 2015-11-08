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
  var commandPath = spec.path
  var requestMethod = (spec.method || 'GET').toUpperCase();
  var urlParams = spec.urlParams || [];
  var duration = spec.cacheDuration || 60000;
  
  return function() {
    var self = this;
    var args = [].slice.call(arguments);
    var cache = self._eve.getCache()
       
    var callback = typeof args[args.length - 1] == 'function' && args.pop();
    var deferred = this.createDeferred(callback);
    var urlData = this.createUrlData();
    
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
        throw new Error('EveClient: I require argument "' + urlParams[i] + '", but I got: ' + arg);
      }

      urlData[param] = args.shift();
    }
    
    var params = utils.getDataFromArgs(args);
    var opts = utils.getOptionsFromArgs(args);
    
    if (args.length) {
      throw new Error(
        'EveClient: Unknown arguments (' + args + '). Did you mean to pass an options object? '
      );
    }
    
    var options = {headers: _.extend(opts.headers, spec.headers)};
    var requestParams = utils.formatRequestParams(self, 
                                                requestMethod, 
                                                urlData, 
                                                options.headers, 
                                                deferred);
    options['Content-Length'] = contentLength(requestParams)                                                
    var requestPath = this.createFullPath(commandPath, requestParams)
    var cacheKey = requestPath
    
    function requestCallback(err, response) {
      if (err) {
        deferred.reject(err);
      } else {
        
        cache.write(cacheKey, response, duration, function(err){
          if(err) deferred.reject(err)
          deferred.resolve(
            spec.transformResponseData ?
              spec.transformResponseData(response) :
              response
          );
        })
      }
    };
    
    cache.read(cacheKey, function(err, data) {
      if(err) return requestCallback(err)
      if(typeof data === 'string') return requestCallback(null, JSON.parse(data))      
      
      self._request(requestMethod, requestPath, requestParams, options, requestCallback);
  
      return deferred.promise;
    })
  };
};

function contentLength(requestParams) {
  return requestParams ? requestParams.length : 0
}

module.exports = eveMethod;