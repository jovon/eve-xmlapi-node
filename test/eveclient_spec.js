'use strict';

var testUtils = require('./testUtils'),
    Promise = require('bluebird'),    
    fs = require('fs'),
    http = require('http'),
    expect = require('chai').expect,
    MemoryCache = require('../lib/cache/memory'),
    FileCache = require('../lib/cache/file');

describe('EveClient Module', function() {  
  this.timeout(20000);

  describe('UserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var eve = require('../lib/EveClient')
      
      var ua = {'User-Agent': {lang:'node'}}
      eve.setUserAgent(ua)
      expect(JSON.parse(eve.getUserAgent())).to.deep.equal(ua);      
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
  
  describe('ApiKey', function(){
    var eve = require('../lib/EveClient')
    eve.setApiKey({})
    it('Should set the key', function(){
      var key = testUtils.getUserEveKey()
      eve.setApiKey(key)
      expect(eve.getApiKey()).to.deep.equal(key)
    })
  })
  
  describe('Cache', function(){
    var eve = require('../lib/EveClient')
    it('Should default to MemoryCache', function(){
      expect(eve.getCache()).to.be.an.instanceof(MemoryCache)
    })
    it('Should be set to FileCache', function(done){
      eve.setCache('file')
      expect(eve.getCache()).to.be.an.instanceof(FileCache)
      var cache = new FileCache()
      cache.clear(done)
    })
  })
  
  describe('Host', function(){
    var eve = require('../lib/EveClient')
    it('Should set host', function(){
      var host = 'api.com'
      eve.setHost(host)
      expect(eve.getApiField('host')).to.eql(host)
    })
  })
});
