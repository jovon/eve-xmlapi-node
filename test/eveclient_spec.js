'use strict';

var testUtils = require('./testUtils'),
    Promise = require('bluebird'),    
    fs = require('fs'),
    http = require('http'),
    expect = require('chai').expect,
    MemoryCache = require('../lib/cache/memory'),
    FileCache = require('../lib/cache/file'),
    Eve = require('../lib/EveClient');

describe('EveClient Module', function() {  
  this.timeout(20000);
  describe('UserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {  
      var eve = new Eve()
      var ua = {'User-Agent': {lang:'node'}}
      eve.setUserAgent(ua)
      expect(JSON.parse(eve.getUserAgent())).to.deep.equal(ua);      
    });
  });

  describe('setTimeout', function() {   
    
    it('Should define a default equal to the node default', function() {
      var eve = new Eve()      
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      var eve = new Eve()
      eve.setTimeout(900);
      expect(eve.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      var eve = new Eve()
      eve.setTimeout(null);
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });
  
  describe('ApiKey', function(){        
    it('Should set the key', function(){
      var eveA = new Eve()     
      var key = {keyID: '123', vCode: '54321'}
      eveA.setApiKey(key)
      expect(eveA.getApiKey()).to.deep.equal(key)      
    })
    it('#setApiKey should return an Error', function(){
      var eveA = new Eve()
      var err = eveA.setApiKey({keyId: '', vCode: ''})
      expect(err).to.be.an('Error')
      expect(eveA.setApiKey()).to.be.an('Error')
    })
  })
  
  describe('Cache', function(){    
    it('Should default to MemoryCache', function(){
      var eve = new Eve()
      expect(eve.getCache()).to.be.an.instanceof(MemoryCache)
    })
    it('Should be set to FileCache', function(done){
      var eve = new Eve()
      eve.setCache('file')
      expect(eve.getCache()).to.be.an.instanceof(FileCache)
      var cache = new FileCache()
      cache.clear(done)
    })
  })
  
  describe('Host', function(){
    it('Should set host', function(){
      var eve = new Eve()
      var host = 'api.com'
      eve.setHost(host)
      expect(eve.getApiField('host')).to.eql(host)
    })
  })
});
