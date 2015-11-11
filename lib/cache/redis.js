var Cache = require('./cache')
  , redis = require('redis')
  , self
module.exports = RedisCache

/**
 * Redis cache.
 *
 * The following options are recognized:
 * <ul>
 *   <li><strong>port</strong>: Port for Redis server</li>
 *   <li><strong>host</strong>: Host address for Redis server</li>
 *   <li><strong>client</strong>: Client for mocking a Redis server</li>
 * </ul>
 *
 * @exports RedisCache as eveapi.cache.RedisCache
 * @param {Object} options
 * @constructor
 */
function RedisCache(options) {
  Cache.call(this)
  self = this;
  options = options || {}
  this._port = options.port || 6379;
  this._host = options.host || '127.0.0.1'
  this._client = options.client || redis.createClient(this._port, this._host)  
}

RedisCache.prototype = Object.create(Cache.prototype)

/**
 * Clear cache.
 *
 * @param  {Function} cb Callback
 */
RedisCache.prototype.clear = function (cb) {
  if(!cb) cb = function(){}
  self._client.flushdb()
  cb()
}


/**
 * Store value in cache.
 *
 * @param {String}   key      Cache key
 * @param {String}   value    Cache Value
 * @param {Number}   duration Number of milliseconds this cache entry will live
 * @param {Function} cb       Callback(err, resp)
 */
RedisCache.prototype.write = function (key, value, duration, cb) {
  var expireTime = this.getCurrentTime() + duration
  var data = {expireTime: expireTime, data: value}     
  self._client.hmset(key, data, function(err, resp){
    if(err) return cb.call(self, err)         
    cb.call(self, null, resp)
  })  
}

/**
 * Retrieve value from cache.
 *
 * @param  {String}   key Cache key
 * @param  {Function} cb  Callback(err, data)
 * @return {String}       Cache value
 */
RedisCache.prototype.read = function (key, cb) {  
  self._client.hgetall(key, function(err, resp){
    if(err) return cb.call(self, err)
    
    if(!resp) return cb.call(self, null, null)
    
    var currentTime = self.getCurrentTime()
    if (currentTime >= parseInt(resp.expireTime)) {
      return cb.call(self, null, null)
    } else {       
      cb.call(self, null, resp.data)
    }                
  })  
}