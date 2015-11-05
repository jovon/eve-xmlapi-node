var querystring = require('querystring'),
    url = require('url')
    
module.exports = Cache

/**
 * @exports Cache as eveonline.cache.Cache
 * @constructor
 */
function Cache() {}

/**
 * Get current time as UNIX timestamp.
 *
 * @return {Number} Current timestamp
 */
Cache.prototype.getCurrentTime = function () {
  return (new Date()).getTime()
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

/**
 * Takes a URL object and returns a string that will be used as the cache key
 * for the resource located at the URL.
 *
 * Currently this just returns a URL string with query string parameters sorted
 * alphabetically.
 *
 * @param  {Object} urlObj URL object
 * @return {String}        Cache key
 */
Cache.prototype.getCacheKey = function (urlObj) {
  var keys = []
    , newUrlObj = {}
    , newQuery = {}
    , oldQuery

  for (var key in urlObj) {
    newUrlObj[key] = urlObj[key]
  }

  if (urlObj.search) {
    oldQuery = querystring.parse(urlObj.search.substr(1))

    for (var key in oldQuery) {
      keys.push(key)
    }

    // Reconstruct query with alphabetical key ordering
    keys.sort().forEach(function (key) {
      newQuery[key] = oldQuery[key]
    })

    // Insertion order should be guaranteed.
    newUrlObj.search = '?' + querystring.stringify(newQuery)
    newUrlObj.path = newUrlObj.pathname + newUrlObj.search
  }

  return url.format(newUrlObj)
}