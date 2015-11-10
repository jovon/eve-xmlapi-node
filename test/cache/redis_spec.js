  var assert = require('chai').assert
    , RedisCache = require(__dirname + '/../../lib/cache/redis')

describe('eveapi.cache.RedisCache', function(){
  describe('#read', function(){
    var cache = new RedisCache()
    var key = 'herp1234'     
    
    it.only('retrieves value from cache', function (done) {
      cache.write(key, 'derp', 15000, function (err) {
        cache.read(key, function (err, value) {
          assert.ifError(err)
          assert.equal(value, 'derp')          
          cache.clear(done)
        })
      })      
    })    
  })
  
  describe('#read other', function(){
    var cache = new RedisCache()
    var key = 'herp2345'
      
    it('passes undefined for expired entry', function (done) {      
      var duration = 50000
      cache.write(key, 'derp', duration, function (err) {
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
  })
})