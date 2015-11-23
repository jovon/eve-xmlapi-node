    
export = Cache
/**
 * @exports Cache as eveonline.cache.Cache
 * @constructor
 */
// export interface iCache {
//   getCurrentTime(): number;
//   write(key: string, value: string, duration: number, cb: Function): void;
//   read(key: string, cb: Function): void;
// }

class Cache {
  write: (key: string, value: string, duration: number, cb: Function)=>void;
  read: (key: string, cb: Function)=>void;
  
  /**
 * Get current time as UNIX timestamp.
 *
 * @return {Number} Current timestamp
 */
  getCurrentTime(): number{
    return (new Date()).getTime()
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
Cache.prototype.write

/**
 * Retrieve value from cache.
 *
 * @param  {String}   key Cache key
 * @param  {Function} cb  Callback
 * @return {String}       Cache value
 */
Cache.prototype.read