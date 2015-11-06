'use strict';


var utils = require('./utils');


module.exports = _Error;

function _Error(raw) {
	this.populate.apply(this, arguments)
	this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function(type, message) {
  this.type = type;
  this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from Eve's XML API)
 */
var EveError = _Error.EveError = _Error.extend({
  type: 'EveError',
  populate: function(raw) {
    // Move from prototype def (so it appears in stringified obj)
    this.type = this.type;

    this.stack = (new Error(raw.message)).stack;
    this.rawType = raw.type;
    this.code = raw.code;
    this.param = raw.param;
    this.message = raw.message;
    this.detail = raw.detail;
    this.raw = raw;
    this.requestId = raw.requestId;
    this.statusCode = raw.statusCode;
  },
});

/**
 * Helper factory which takes raw eve errors and outputs wrapping instances
 */
EveError.generate = function(rawEveError) {
  switch (rawEveError.type) {
    case 'card_error':
      return new _Error.EveCardError(rawEveError);
    case 'invalid_request_error':
      return new _Error.EveInvalidRequestError(rawEveError);
    case 'api_error':
      return new _Error.EveAPIError(rawEveError);
  }
  return new _Error('Generic', 'Unknown Error');
};

// Specific Eve Error types:
_Error.EveCardError = EveError.extend({type: 'EveCardError'});
_Error.EveInvalidRequestError = EveError.extend({type: 'EveInvalidRequestError'});
_Error.EveAPIError = EveError.extend({type: 'EveAPIError'});
_Error.EveAuthenticationError = EveError.extend({type: 'EveAuthenticationError'});
_Error.EveRateLimitError = EveError.extend({type: 'EveRateLimitError'});
_Error.EveConnectionError = EveError.extend({type: 'EveConnectionError'})