'use strict';
var config = require('./config')
// NOTE: testUtils should be require'd before anything else in each spec file!

require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));

var utils = module.exports = {

  getUserEveKey: function() {
    var key = {
			keyID: process.env.EVE_TEST_API_KEYID || config.TEST_KEYID || '123456',
			vCode: process.env.EVE_TEST_API_VCODE || config.TEST_VCODE || 'tGN0bIwXnHdwOa85VABjPdSn8nWY7G7I',
      
		};

    return key;
  },
  
  getParams: function () {
    var params = this.getUserEveKey()
    params['characterID'] = process.env.EVE_TEST_API_CHARID || config.TEST_CHARID || '123'
    return params
  },

  getSpyableEveApi: function() {
    // Provide a testable eve instance
    // That is, with mock-requests built in and hookable

    var EveInstance = require('../lib/EveClient')();
    
    EveInstance.REQUESTS = [];
    
    for (var i in EveInstance) {
      if (EveInstance[i] instanceof EveInstance.EveResource) {
        // Override each _request method so we can make the params
        // available to consuming tests (revealing requests made on
        // REQUESTS and LAST_REQUEST):
        EveInstance[i]._request = function(method, url, data, options, cb) {
          var req = EveInstance.LAST_REQUEST = {
            method: method,
            url: url,
            data: data || '',
            headers: options.headers || {},
          };
                    
          EveInstance.REQUESTS.push(req);
          cb.call(this, null, {});
        };
      }
    }

    return EveInstance;
  },
  /**
   * A utility where cleanup functions can be registered to be called post-spec.
   * CleanupUtility will automatically register on the mocha afterEach hook,
   * ensuring its called after each descendent-describe block.
   */
  CleanupUtility: (function() {
    CleanupUtility.DEFAULT_TIMEOUT = 20000;

    function CleanupUtility(timeout) {
      var self = this;
      this._cleanupFns = [];
      this._eve = require('../lib/EveClient')
      
      afterEach(function(done) {
        this.timeout(timeout || CleanupUtility.DEFAULT_TIMEOUT);
        return self.doCleanup(done);
      });
    }

    CleanupUtility.prototype = {

      doCleanup: function(done) {
        var cleanups = this._cleanupFns;
        var total = cleanups.length;
        var completed = 0;
        for (var fn; fn = cleanups.shift();) {
          var promise = fn.call(this);
          if (!promise || !promise.then) {
            throw new Error('CleanupUtility expects cleanup functions to return promises!');
          }
          promise.then(function() {
            // cleanup successful
            ++completed;
            if (completed === total) {
              done();
            }
          }, function(err) {
            // not successful
            throw err;
          });
        }
        if (total === 0) {
          done();
        }
      }      
    };

    return CleanupUtility;
  }()),
};