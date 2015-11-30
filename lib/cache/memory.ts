
import Cache = require('./cache')

export = MemoryCache
interface inMem {
  [key: string]: string;
}
/**
 * Process memory cache.
 *
 * @exports MemoryCache as eveonline.cache.MemoryCache
 * @constructor
 */
class MemoryCache extends Cache {
  write: (key: string, value: string, duration: number, cb: Function)=>void;
  read: (key: string, cb: Function)=>void;
  private _cache: inMem;  
  constructor() {
    super()
    this._cache = {}
  };
  getCurrentTime(): number {
    return super.getCurrentTime();
  }
}


/**
 * Store value in cache.
 *
 * @param {String}   key      Cache key
 * @param {String}   value    Cache Value
 * @param {Number}   duration Number of seconds this cache entry will live
 * @param {Function} cb       Callback
 */
MemoryCache.prototype.write = function write(key: string, value: string, duration: number, cb: Function) {
  var expireTime = this.getCurrentTime() + duration
  
  this._cache[key] = {
    value: value,
    expireTime: expireTime
  }

  cb(null)
}

/**
 * Retrieve value from cache.
 *
 * @param  {String}   key Cache key
 * @param  {Function} cb  Callback
 * @return {String}       Cache value
 */
MemoryCache.prototype.read = function read(key: string, cb: Function) {
  var value: string
  
  if (this._cache[key] && (this.getCurrentTime() < this._cache[key].expireTime)) {
    value = this._cache[key].value
  }

  cb(null, value)
}

