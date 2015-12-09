import http = require('http');
import https = require('https');
import path = require('path');
import Promise = require('bluebird');
import _ = require('lodash');
import globals = require('./globals')
var parseString = require('xml2js').parseString;

var utils = require('./utils');
import error = require('./Error');

var hasOwn = {}.hasOwnProperty;
var method = require('./EveMethod');

/**
 * Encapsulates request logic for an Eve Resource
 */
class EveResource {
	public _eve: any;
	private initialize: Function;
	public extend: Function;
	public method: Function;
	public path: string;
	public overrideHost: string;
	constructor(eve: any) {
		this._eve = eve;
		// Provide extension mechanism for Eve Resource Sub-Classes
		this.extend = utils.protoExtend;

		// Expose method-creator & prepared (basic) methods
		this.method = method
		// this.initialize.apply(this, arguments);
		this.path = '';
    
		// String that overrides the base API endpoint. If `overrideHost` is not null
		// then all requests for a particular resource will be sent to a base API
		// endpoint as defined by `overrideHost`.
		this.overrideHost = null;
	}
  
	/* 
	 * Function to override the default query param processor.
	 */
	requestParamProcessor: Function = null;

	authParamProcessor: Function = null;

	createFullPath(requestPath: string, params: string): string {
		if (params) requestPath = requestPath + '?' + params;
		return requestPath
	};

	createDeferred(args: any, cb: Function) {
		var func: Function
		if(typeof args === 'function') {
			func = args
		} else if (cb) {
			func = cb
		}
		
		function convertToPromise(callback: Function) {
			var deferred = Promise.defer();
			if(callback) {
				// Callback, if provided, is simply translated to Promise'esque:
				// (Ensure callback is called outside of promise stack)
				deferred.promise.then(function(res) {
					setTimeout(function() { callback(null, res) }, 0);
				}, function(err) {
					setTimeout(function() { callback(err, null); }, 0);
				});
			}
			return deferred;
		}
		return convertToPromise(func)
		
	};

	_timeoutHandler(timeout: number, req: any, callback: Function) {
		var self = this;
		return function() {
			var timeoutErr = new Error('ETIMEDOUT');

			req._isAborted = true;
			req.abort();

			callback.call(
				self,
				new error.EveConnectionError({
					message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
					detail: timeoutErr,
				}),
				null
			);
		}
	};

	_responseHandler(req: any, callback: Function) {
		var self = this;

		return function(res: http.ClientResponse) {
			var response = '';

			res.setEncoding('utf8');
			res.on('data', function(chunk: any) {
				response += chunk;
			});
			res.on('error', function(e: Error) {
				callback.call(self, new Error("Error in response handler"))
			});
			res.on('end', function() {
				var headers = res.headers || {};

				parseString(response, function(err: Error, result: any) {
					if (err) return callback.call(self, new Error("Error parsing"))

					if (result && result.eveapi && result.eveapi.error) {
						var errorMessage = result.eveapi.error[0]._
						var errorCode = result.eveapi.error[0].$.code

						callback.call(self,
							new error.EveAPIError({ message: errorMessage, code: errorCode }),
							null);
					} else {
						callback.call(self, null, result);
					}
				})
			});
		};
	};

	_errorHandler(req: any, callback: Function) {
		var self = this;
		return function(err: Error) {
			if (req._isAborted) {
				// already handled
				return;
			}

			callback.call(
				self,
				new error.EveConnectionError({
					message: 'An error occurred with our connection to Eve Api',
					detail: err,
				}),
				null
			);
		}
	};

	_request(method: string, path: string, params: string, headers: globals.Headers, callback: Function) {
		var self = this;
		var timeout = self._eve.getApiField('timeout');

		var opt: http.RequestOptions = {
			host: self.overrideHost || self._eve.getApiField('host'),
			port: self._eve.getApiField('port'),
			path: path,
			method: method,
			agent: self._eve.getApiField('agent'),
			headers: headers,
		}

		var isInsecureConnection = self._eve.getApiField('protocol') === 'http',
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

	};

};

export = EveResource;