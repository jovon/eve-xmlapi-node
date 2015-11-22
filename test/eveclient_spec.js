'use strict';

var testUtils = require('./testUtils'),
    Promise = require('bluebird'),    
    fs = require('fs'),
    http = require('http'),
    expect = require('chai').expect;

describe('EveClient Module', function() {  
  this.timeout(20000);

  describe('ClientUserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var d = Promise.defer();
      var eve = require('../lib/EveClient')
      
      eve.getClientUserAgent(function(c) {
        d.resolve(JSON.parse(c));
      });
      return expect(d.promise).to.eventually.have.property('lang', 'node');
    });
  });

  describe('setTimeout', function() {
    var eve = require('../lib/EveClient')
    
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
  
  describe('setApiKey', function(){
    var eve = require('../lib/EveClient')
    eve.setApiKey({})
    it('Should set the key', function(){
      var key = testUtils.getUserEveKey()
      eve.setApiKey(key)
      expect(eve.getApiKey()).to.deep.equal(key)
    })
  }) 
  
    
});
