import Cache = require('./cache')
var redis = require('redis')


export = RedisCache

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
class RedisCache extends Cache {
  private _port: number;
  private _host: string;
  private _client: any;
  constructor(options?: any) {
    super()
    options = options || {}
    this._port = options.port || 6379;
    this._host = options.host || '127.0.0.1'
    this._client = options.client || redis.createClient(this._port, this._host)  
  }

  /**
  * Clear cache for testing.
  *
  * @param  {Function} cb Callback
  */
  clear(cb: Function) {
    if(!cb) cb = function(){}
    this._client.flushdb()
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
  write = function (key: string, value: string, duration: number, cb: Function) {
    var expireTime: number = this.getCurrentTime() + duration
    var data = {expireTime: expireTime, data: value}     
    this._client.hmset(key, data, function(err: Error, resp: string){
      if(err) return cb.call(this, err)         
      cb.call(this, null, resp)
    })  
  }
  
  /**
  * Retrieve value from cache.
  *
  * @param  {String}   key Cache key
  * @param  {Function} cb  Callback(err, data)
  * @return {String}       Cache value
  */
  read = function (key: string, cb: Function) { 
    var self = this; 
    this._client.hgetall(key, function(err: Error, resp: any){
      if(err) return cb.call(self, err)
      
      if(!resp) return cb.call(self, null, null)
      
      var currentTime: number = self.getCurrentTime()
      if (currentTime >= parseInt(resp.expireTime)) {
        return cb.call(self, null, null)
      } else {       
        cb.call(self, null, resp.data)
      }                
    })  
  }
}