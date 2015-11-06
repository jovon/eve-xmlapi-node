'use strict';

var testUtils = require('./testUtils');
var Promise = require('bluebird');
var eve = require('../lib/eveclient')(
  testUtils.getUserEveKey(),
  'latest'
);

var expect = require('chai').expect;

describe('EveClient Module', function() {
  var cleanup = new testUtils.CleanupUtility();
  this.timeout(20000);

  describe('ClientUserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var d = Promise.defer();
      eve.getClientUserAgent(function(c) {
        d.resolve(JSON.parse(c));
      });
      return expect(d.promise).to.eventually.have.property('lang', 'node');
    });
  });

  describe('setTimeout', function() {
    it('Should define a default equal to the node default', function() {
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      eve.setTimeout(900);
      expect(eve.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      eve.setTimeout(null);
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });

  describe('Callback support', function() {
    describe('Any given endpoint', function() {
      it('Will call a callback if successful', function() {
        var defer = Promise.defer();
        
        eve.callList.fetch(function(err, queue){
            defer.resolve('Called!');
        });

        return expect(defer.promise).to.eventually.equal('Called!');
      });

      it('Given an error the callback will receive it', function() {
        var defer = Promise.defer();

        eve.skillQueue.fetch(function(err, queue) {          
          if (err) {
            defer.resolve('ErrorWasPassed');
          } else {
            defer.reject('NoErrorPassed');
          }
        });

        return expect(defer.promise).to.eventually.become('ErrorWasPassed')
      });
    });
  });
});