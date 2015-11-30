'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Cache = require('./cache');
var FileCache = (function (_super) {
    __extends(FileCache, _super);
    function FileCache(options) {
        _super.call(this);
        this.write = function write(key, value, duration, cb) {
            var file = this.getFilePath(key), dir = path.dirname(file), self = this;
            self.makeDirs(dir, function (err) {
                if (err)
                    return cb.call(self, err);
                var expireT = self.expireTime(duration);
                var meta = JSON.stringify({ expireTime: expireT }), data = new Buffer([meta, value].join('\n'));
                fs.open(file, 'w', function (err, fd) {
                    if (err)
                        return cb.call(self, err);
                    fs.write(fd, data, 0, data.length, null, function (err) {
                        if (err)
                            return cb.call(self, err);
                        fs.close(fd, function () {
                            cb.call(self, null, file);
                        });
                    });
                });
            });
        };
        this.read = function read(key, cb) {
            var file = this.getFilePath(key), self = this;
            fs.readFile(file, function (err, data) {
                if (err) {
                    if (err.code === 'ENOENT')
                        return cb(null, null, file);
                    return cb(err, null, file);
                }
                var dataStr = data.toString().split('\n', 2);
                var meta = JSON.parse(dataStr[0]);
                var currentTime = self.getCurrentTime();
                if (currentTime >= meta.expireTime) {
                    fs.unlink(file, function (err) {
                        if (err)
                            return cb(err, null, file);
                        cb(null, null, file);
                    });
                }
                else {
                    cb(null, dataStr[1], file);
                }
            });
        };
        var tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
        options = options || {};
        this.setPath(options.path || path.join(tmpDir, 'eveapi-cache'));
        this.setPrefix(options.prefix || '');
    }
    FileCache.prototype.setPath = function (p) {
        this._path = p;
    };
    ;
    FileCache.prototype.getPath = function () {
        return this._path;
    };
    ;
    FileCache.prototype.setPrefix = function (prefix) {
        this._prefix = prefix;
    };
    ;
    FileCache.prototype.getPrefix = function () {
        return this._prefix;
    };
    ;
    FileCache.prototype.getFilePath = function (key) {
        var hash = crypto.createHash('sha1'), sha1 = hash.update(key).digest('hex'), file = this.getPrefix() + sha1;
        return path.join(this.getPath(), sha1.substr(0, 4), sha1.substr(4, 4), file);
    };
    ;
    FileCache.prototype.clear = function (cb) {
        if (!cb)
            cb = function () { };
        var self = this;
        var clearDir = function (dir, cb) {
            fs.readdir(dir, function (err, files) {
                if (err)
                    cb.call(self, err);
                if (!files.length)
                    return cb.call(self, null);
                var remaining = files.length;
                var removeDir = function () {
                    if (!(--remaining)) {
                        if (self.getPath() === dir)
                            return cb.call(self, null);
                        fs.rmdir(dir, function () {
                            cb.call(self, null);
                        });
                    }
                };
                files.forEach(function (file) {
                    file = path.join(dir, file);
                    fs.stat(file, function (err, stats) {
                        if (err)
                            cb.call(self, err);
                        if (stats.isDirectory()) {
                            clearDir(file, function (err) {
                                if (err)
                                    cb.call(self, err);
                                fs.rmdir(file, removeDir);
                            });
                        }
                        else {
                            fs.unlink(file, removeDir);
                        }
                    });
                });
            });
        };
        try {
            var dir = this.getPath();
            fs.exists(dir, function (exists) {
                if (exists) {
                    clearDir(dir, cb);
                }
                else {
                    return cb(null);
                }
            });
        }
        catch (err) {
            cb(err);
        }
    };
    FileCache.prototype.makeDirs = function (dir, cb) {
        if (!cb)
            cb = function () { };
        var self = this;
        fs.exists(dir, function (exists) {
            if (exists) {
                cb(null);
            }
            else {
                fs.mkdir(dir, function (err) {
                    if (err) {
                        if (err.code !== 'ENOENT')
                            return cb(err);
                        self.makeDirs(path.dirname(dir), function (err) {
                            if (err)
                                return cb(err);
                            self.makeDirs(dir, cb);
                        });
                    }
                    else {
                        cb(null);
                    }
                });
            }
        });
    };
    ;
    FileCache.prototype.expireTime = function (duration) {
        return (new Date()).getTime() + duration;
    };
    return FileCache;
})(Cache);
module.exports = FileCache;
//# sourceMappingURL=file.js.map