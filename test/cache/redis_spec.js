  var assert = require('chai').assert
    , RedisCache = require(__dirname + '/../../lib/cache/redis')
    , client = require("fakeredis").createClient()

describe('eveapi.cache.RedisCache', function(){
  describe('#read', function(){
    var cache = new RedisCache({client: client})
    var key = 'key'
    var value = {'test': 'value'}    
    before(function(done){
      cache.clear()
      cache.write(key, JSON.stringify(value), 15000, function (err) {
        if (err) return done(err)
        done()
      })
    })
    it('retrieves value from cache', function (done) {       
      cache.read(key, function (err, v) {
        assert.isNull(err)
        assert.deepEqual(JSON.parse(v), value)       
        done()
      }) 
    })    
  })
  
  describe('#read expired', function(){
    var cache = new RedisCache({client: client})
    var key = 'key'
    var value = {'test': 'value'}
    var duration = 5000    
    before(function(done){
      cache.clear()                 
      cache.write(key, JSON.stringify(value), duration, function (err) {
        if (err) return done(err)
        done()
      })
    })      
    it('passes undefined for expired entry', function (done) {            
      cache.read(key, function (err, v) {
        assert.isNull(err)
        assert.deepEqual(value, JSON.parse(v))
        
        cache.getCurrentTime = function () {
          return (new Date()).getTime() + duration
        }
        
        cache.read(key, function (err, value) {
          assert.isNull(value)
          done()
        })          
      })  
    })
  })
})