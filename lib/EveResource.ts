import http = require('http');
import https = require('https');
import path = require('path');
import Promise = require('bluebird');
import _ = require('lodash');
var parseString = require('xml2js').parseString;

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;

// Provide extension mechanism for Eve Resource Sub-Classes
EveResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
EveResource.method = require('./EveMethod');

/**
 * Encapsulates request logic for an Eve Resource
 */
function EveResource(eve: any) {
  this._eve = eve;
  
  this.initialize.apply(this, arguments);
}

EveResource.prototype = {

  path: '',

  initialize: function() {},

  /* 
  * Function to override the default data processor. This allows full control
  * over how a EveResource's request data will get converted into an HTTP
  * body. This is useful for non-standard HTTP requests. The function should
  * take method name, data, and headers as arguments.
  */
  requestParamProcessor: null,

  // String that overrides the base API endpoint. If `overrideHost` is not null
  // then all requests for a particular resource will be sent to a base API
  // endpoint as defined by `overrideHost`.
  overrideHost: null,

  createFullPath: function(requestPath: string, params: string) {
    if(params) return requestPath + '?' + params;   
    return requestPath 
  },

  createDeferred: function(callback: Function) {
    var deferred = Promise.defer();

    if (callback) {
      // Callback, if provided, is a simply translated to Promise'esque:
      // (Ensure callback is called outside of promise stack)
      deferred.promise.then(function(res) {
          setTimeout(function() { callback(null, res) }, 0);
        }, function(err) {
          setTimeout(function() { callback(err, null); }, 0);
        });
    }

    return deferred;
  },

  _timeoutHandler: function(timeout: number, req: http.ClientRequest, callback: Function) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self,
        new Error.EveConnectionError({
          message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
          detail: timeoutErr,
        }),
        null
      );
    }
  },

  _responseHandler: function(req: http.ClientRequest, callback: Function) {
    var self = this;     
      
    return function(res: http.ClientResponse) {
      var response = '';
     
      res.setEncoding('utf8');      
      res.on('data', function(chunk: any) {
        response += chunk;
      });
      res.on('error', function(e: Error){
        callback.call(self, new Error("Error in response handler"))
      });
      res.on('end', function() {
        var headers = res.headers || {};
        parseString(response, function(err: Error, result: any){
          if (err) return callback.call(self, new Error("Error parsing"))
          try {            
            if (result && result.eveapi && result.eveapi.error) {              
              var errorMessage = result.eveapi.error[0]._
              var errorCode = result.eveapi.error[0].$.code
              
              err.message = errorMessage
              err.code = errorCode
              callback.call(self, err, null);
            } else {                            
              callback.call(self, null, result);
            }
          } catch (e) {                    
            return callback.call(
              self,
              new Error.EveAPIError({
                message: 'Invalid XML received from the Eve API',
                response: result,
                exception: e,
                requestId: headers['request-id'],
              }),
              null
            );
          }     
          
        })
      });
    };
  },

  _errorHandler: function(req: http.ClientRequest, callback: Function) {
    var self = this;    
    return function(error: Error) {
      if (req._isAborted) {
        // already handled
        return;
      }
      
      callback.call(
        self,
        new Error.EveConnectionError({
          message: 'An error occurred with our connection to Eve Api',
          detail: error,
        }),
        null
      );
    }
  },

  _request: function(method: string, path: string, params: string, options: any, callback: Function) {
    var self = this;    
       
    var apiVersion = this._eve.getApiField('version');    
    
    var headers: Headers = {      
      'Accept': 'application/xml',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': options.contentLength,
      'User-Agent': 'EveAPI-node/' + this._eve.getConstant('PACKAGE_VERSION'),
    };
    
    if (apiVersion) {
      headers['EveApi-Version'] = apiVersion;
    }

    // Grab client-user-agent before making the request:
    this._eve.getClientUserAgent(function(cua: string) {
      headers['X-Client-User-Agent'] = cua;

      if (options.headers) {
        headers = _.extend(headers, options.headers);
      }

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
      }
      var isInsecureConnection = self._eve.getApiField('protocol') === 'http' ,
          req = (isInsecureConnection ? http : https).request(opt);
      
      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));
      req.on('socket', function(socket: any) {
        socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function() {
          // Send payload; we're safe:          
          req.write(params || '');
          req.end();
        });
      });      
    }
  },

};

module.exports = EveResource;