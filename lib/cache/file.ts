'use strict';
import fs = require('fs')
import path = require('path')
import crypto = require('crypto')
import Cache = require('./cache')

export = FileCache

/**
 * File cache.
 *
 * The following options are recognized:
 * <ul>
 *   <li><strong>path</strong>: Path to directory where cache files will be saved</li>
 *   <li><strong>prefix</strong>: Prefix to be used in cache file names (default: <tt>''</tt>)</li>
 * </ul>
 *
 * @exports FileCache as eveapi.cache.FileCache
 * @param {Object} options
 * @constructor
 */
class FileCache extends Cache {
  private _path: string;
  private _prefix: string;
  constructor(options: any) {
    super()
    var tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp'
    options = options || {}
    
    this.setPath(options.path || path.join(tmpDir, 'eveapi-cache'))
    this.setPrefix(options.prefix || '')
  }



  /**
  * Set path to cache directory.
  *
  * @param {String} p Directory path
  */
  setPath(p: string) {
    this._path = p
  };
  
  /**
  * Get path to cache directory.
  *
  * @return {String} Directory path
  */
  getPath() {
    return this._path
  };
  
  /**
  * Set file name prefix.
  *
  * @param {String} prefix Prefix string
  */
  setPrefix(prefix: string) {
    this._prefix = prefix
  };
  
  /**
  * Get file name prefix.
  *
  * @return {String} Prefix string
  */
  getPrefix() {
    return this._prefix
  };
  
  /**
  * Get path to file identified by the specified cache key.
  *
  * @param  {String} key Cache key
  * @return {String}     Path
  */
  getFilePath(key: string) {
    var hash = crypto.createHash('sha1')
      , sha1 = hash.update(key).digest('hex')
      , file = this.getPrefix() + sha1
  
    return path.join(this.getPath(), sha1.substr(0, 4), sha1.substr(4, 4), file)
  };
  
  /**
  * Clear file cache for testing.
  *
  * @param  {Function} cb Callback(Error)
  */
  clear(cb: Function) {
    if (!cb) cb = function () {}
  
    var self = this
    var clearDir = function (dir: string, cb: Function) {
      fs.readdir(dir, function (err, files) {
        if (err) cb.call(self, err)
        if (!files.length) return cb.call(self, null)
  
        var remaining = files.length
        var removeDir = function () {
          if (!(--remaining)) {
            if (self.getPath() === dir) return cb.call(self, null)
  
            fs.rmdir(dir, function () {
              cb.call(self, null)
            })
          }
        }
  
        files.forEach(function (file) {
          file = path.join(dir, file)
  
          fs.stat(file, function (err, stats) {
            if (err) cb.call(self, err)
  
            if (stats.isDirectory()) {
              clearDir(file, function (err: Error) {
                if (err) cb.call(self, err)
                fs.rmdir(file, removeDir)
              })
            } else {
              fs.unlink(file, removeDir)
            }
          })
        })
      })
    }
  
    try {
      var dir = this.getPath()    
      fs.exists(dir, function(exists){
        if(exists) {
          clearDir(dir, cb)
        } else {
          return cb(null)
        }
      })   
    } catch (err) {
      cb(err)
    }
  }
  
  /**
  * Recursively create directories.
  *
  * @param  {String}   dir Dir name
  * @param  {Function} cb  Callback
  */
  makeDirs(dir: string, cb: Function) {
    if (!cb) cb = function () {}
  
    var self = this
    
    fs.exists(dir, function (exists) {
      if (exists) {
        cb(null)
      } else {
        fs.mkdir(dir, function (err) {
          if (err) {
            if (err.code !== 'ENOENT') return cb(err)
  
            self.makeDirs(path.dirname(dir), function (err: Error) {
              if (err) return cb(err)
  
              self.makeDirs(dir, cb)
            })
          } else {
            cb(null)
          }
        })
      }
    })
  };
  
  /**
  * Store value in cache.
  *
  * @param {String}   key      Cache key
  * @param {String}   value    Cache Value
  * @param {Number}   duration Number of milliseconds this cache entry will live
  * @param {Function} cb       Callback(Error, fileName)
  */
  write = function write(key: string, value: string, duration: number, cb: Function) {
    var file = this.getFilePath(key)
      , dir = path.dirname(file)
      , self = this
      
    self.makeDirs(dir, function (err: Error) {
      if (err) return cb.call(self, err)
      var expireT = self.expireTime(duration)    
      var meta = JSON.stringify({expireTime: expireT})
          , data = new Buffer([meta, value].join('\n'))
          
      
      fs.open(file, 'w', function(err, fd) {
          if (err) return cb.call(self, err)
          
          fs.write(fd, data, 0, data.length, null, function(err) {
              if (err) return cb.call(self, err)
              fs.close(fd, function() {
                  cb.call(self, null, file)
              })
          });
      });
    })
  };
  
  
  expireTime(duration: number){  
    return (new Date()).getTime() + duration
  }
  
  /**
  * Retrieve value from cache.
  *
  * @param  {String}   key Cache key
  * @param  {Function} cb  Callback(Error, Data, FileName)
  * @return {String}       Cache value
  */
  read = function read(key: string, cb: Function) {
    var file = this.getFilePath(key)
      , self = this
  
    fs.readFile(file, function (err, data) {    
      if (err) {      
        if (err.code === 'ENOENT') return cb(null, null, file)
        return cb(err, null, file)
      }
      
      var dataStr = data.toString().split('\n', 2)
      var meta = JSON.parse(dataStr[0])
      var currentTime = self.getCurrentTime()
      
      if (currentTime >= meta.expireTime) {
        fs.unlink(file, function (err) { 
          if(err) return cb(err, null, file)
          cb(null, null, file) 
        })
      } else {
        cb(null, dataStr[1], file)
      }
    })
  }
}
