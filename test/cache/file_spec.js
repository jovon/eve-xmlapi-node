var assert = require('assert')
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
      var cache = new FileCache()
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
    it('retrieves value from cache', function (done) {
      var cache = new FileCache({prefix: 'test1-'})
    
      cache.write('herp', 'derp', 15, function (err) {
        assert.ifError(err)
    
        cache.read('herp', function (err, value) {
          assert.ifError(err)
          assert.equal(value, 'derp')
    
          cache.read('herp', function (err, value) {
            assert.ifError(err)
            assert.equal(value, 'derp')        
          })
        })
        cache.clear(done)
      })
    })
    
    it('passes undefined for expired entry', function (done) {
      var cache = new FileCache({prefix: 'test2-'})
        , duration = 15
    
      cache.write('herp', 'derp', duration, function (err) {
        assert.ifError(err)
    
        cache.read('herp', function (err, value) {
          assert.ifError(err)
          assert.equal(value, 'derp')
    
          cache.getCurrentTime = function () {
            return (new Date()).getTime() + duration
          }
    
          cache.read('herp', function (err, value) {
            assert.ifError(err)
            assert.ok(typeof value === 'undefined')
            
          })
        })
      })
      cache.clear(done)
    })
    
    it('does not error on ENOENT', function (done) {
      var cache = new FileCache({prefix: 'test3-'})
    
      cache.read('herp', function (err, value) {
        assert.ifError(err)
        assert.ok(typeof value === 'undefined')
        
      })
      cache.clear(done)
    })
  })
})