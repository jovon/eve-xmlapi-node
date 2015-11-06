var assert = require('chai').assert
  , fs = require('fs')
  , path = require('path')
  , FileCache = require(__dirname + '/../../lib/cache/file')

describe('eveapi.cache.FileCache', function(){
  describe('#getFilePath()', function(){
    it('returns path to cache entry', function () {
      var cache = new FileCache({path: '/tmp'})
    
      assert.equal(cache.getFilePath('herp'), '/tmp/dcbc/8f63/dcbc8f63b06c899b9db957f0e03466860fce8056')
    })
    
    it('prepends prefix to file name', function () {
      var cache = new FileCache({path: '/tmp', prefix: 'herp-'})
    
      assert.equal(cache.getFilePath('derp'), '/tmp/e057/d4ea/herp-e057d4ea363fbab414a874371da253dba3d713bc')
    })
  })
  
  describe('#makeDirs()', function(){
    it('recursively creates directories', function (done) {
      var cache = new FileCache({fs: fs})
        , dir = path.join(cache.getPath(), 'foo', 'bar', 'baz')
    
      fs.exists(dir, function (exists) {
        assert.ok(!exists)
    
        cache.makeDirs(dir, function (err) {
          assert.ifError(err)
    
          fs.exists(dir, function (exists) {
            assert.ok(exists)
            cache.clear(done)
          })
        })
      })
    })
  })
  
  describe('#read', function(){
    var cache = new FileCache({prefix: 'test1-', path: '/tmp/testCache'})
    var key = 'herp1234'
    
    
    it('retrieves value from cache', function (done) {
      cache.write(key, 'derp', 15000, function (err, fileName) {            
        cache.read(key, function (err, value, file) {
          assert.ifError(err)
          assert.equal(file, fileName)
          assert.equal(value, 'derp')    
          
          cache.clear(done)        
        })
      })      
    })    
  })
  
  describe('#read other', function(){
    var cache = new FileCache({prefix: 'test2-', path: '/tmp/testCache'})
    var key = 'herp2345'
        
    it('passes undefined for expired entry', function (done) {      
      var duration = 50000
      cache.write(key, 'derp', duration, function (err, fileName) {      
        cache.read(key, function (err, value) {
          assert.ifError(err)
          assert.equal(value, 'derp')
    
          cache.getCurrentTime = function () {
            return (new Date()).getTime() + duration
          }
    
          cache.read(key, function (err, value) {
            assert.ifError(err)
            assert.isNull(value)
            cache.clear(done)
          })
          
        })
      })      
    })
    
    it('does not error on ENOENT', function (done) {
      cache.setPrefix('test3-')
    
      cache.read(key, function (err, value) {
        assert.ifError(err)
        assert.isNull(value)
        cache.clear(done)
      })
      
    })
  })
})