var crypto = require('crypto')
  , Cache = require('./cache')
  , redis = require('redis')
  , self
module.exports = RedisCache

/**
 * File cache.
 *
 * The following options are recognized:
 * <ul>
 *   <li><strong>path</strong>: Path to directory where cache files will be saved</li>
 *   <li><strong>prefix</strong>: Prefix to be used in cache file names (default: <tt>''</tt>)</li>
 * </ul>
 *
 * @exports RedisCache as hamster.cache.RedisCache
 * @param {Object} options
 * @constructor
 */
function RedisCache(options) {
  Cache.call(this)
  self = this;
  options = options || {}
  this._client = redis.createClient(options.port || 6379, options.host || '127.0.0.1')
  
  this.setPrefix(options.prefix || '')
}

RedisCache.prototype = Object.create(Cache.prototype)

/**
 * Set path to cache directory.
 *
 * @param {String} p Directory path
 */
RedisCache.prototype.setPath = function (p) {
  this._path = p
}

/**
 * Get path to cache directory.
 *
 * @return {String} Directory path
 */
RedisCache.prototype.getPath = function () {
  return this._path
}

/**
 * Set file name prefix.
 *
 * @param {String} prefix Prefix string
 */
RedisCache.prototype.setPrefix = function (prefix) {
  this._prefix = prefix
}

/**
 * Get file name prefix.
 *
 * @return {String} Prefix string
 */
RedisCache.prototype.getPrefix = function () {
  return this._prefix
}

/**
 * Clear file cache.
 *
 * @param  {Function} cb Callback
 */
RedisCache.prototype.clear = function (cb) {
  cb()
}


/**
 * Store value in cache.
 *
 * @param {String}   key      Cache key
 * @param {String}   value    Cache Value
 * @param {Number}   duration Number of seconds this cache entry will live
 * @param {Function} cb       Callback
 */
RedisCache.prototype.write = function (key, value, duration, cb) {
  var expireTime = this.getCurrentTime() + duration
  var data = {expireTime: expireTime, data: value}    
  self._client.hmset(key, data, function(err, resp){
    if(err) return cb.call(self,err)
    return cb.call(self, null, resp)    
        
  })
  self._client.end()
}

/**
 * Retrieve value from cache.
 *
 * @param  {String}   key Cache key
 * @param  {Function} cb  Callback
 * @return {String}       Cache value
 */
RedisCache.prototype.read = function (key, cb) {
  self._client.hgetall(key, function(err, resp){
    if(err) return cb(err)
    var currentTime = self.getCurrentTime()
    if (currentTime >= resp.expireTime) {
      return cb.call(self)
    } else {
      return cb.call(self, null, resp.data)
    }        
  })
  self._client.end()  
}