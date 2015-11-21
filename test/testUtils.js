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

    var EveInstance = require('../lib/EveClient');
    
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
};