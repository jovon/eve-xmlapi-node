/// <reference path="../typings/app/app.d.ts"/>
var exec = require('child_process').exec, DEFAULT_HOST = 'api.testeveonline.com', DEFAULT_BASE_PATH = '', DEFAULT_API_VERSION = '2', DEFAULT_PORT = '443', DEFAULT_PROTOCOL = 'https', DEFAULT_TIMEOUT = require('http').createServer().timeout;
var resources = {
    CallList: require('./resources/CallList'),
    SkillQueue: require('./resources/SkillQueue'),
    CharacterID: require('./resources/CharacterID'),
    ServerStatus: require('./resources/ServerStatus'),
    Characters: require('./resources/Characters')
};
var api = {
    auth: null,
    host: DEFAULT_HOST,
    basePath: DEFAULT_BASE_PATH,
    version: '',
    timeout: DEFAULT_TIMEOUT,
    port: DEFAULT_PORT,
    protocol: DEFAULT_PROTOCOL,
    agent: null,
    dev: true
};
function EveClient(args) {
    var version = '', cache = '', self = this;
    if (!(this instanceof EveClient)) {
        return new EveClient(args);
    }
    if (args) {
        version = args['version'] || this.DEFAULT_API_VERSION;
        this.USER_AGENT_SERIALIZED = args['User-Agent'] || null;
        if (args['cache'])
            cache = args['cache'];
    }
    this._api = api;
    this.EveResource = require('./EveResource');
    this.cache = {};
    this.cache.Cache = require('./cache/cache');
    this.cache.MemoryCache = require('./cache/memory');
    this.cache.FileCache = require('./cache/file');
    this.cache.RedisCache = require('./cache/redis');
    this._cache = new this.cache.MemoryCache();
    this.DEFAULT_HOST = DEFAULT_HOST;
    this.DEFAULT_BASE_PATH = DEFAULT_BASE_PATH;
    this.DEFAULT_API_VERSION = DEFAULT_API_VERSION;
    this.DEFAULT_PORT = DEFAULT_PORT;
    this.DEFAULT_PROTOCOL = DEFAULT_PROTOCOL;
    this.DEFAULT_TIMEOUT = require('http').createServer().timeout;
    this.PACKAGE_VERSION = require('../package.json').version;
    this.USER_AGENT = {
        client_version: self.PACKAGE_VERSION,
        lang: 'node',
        lang_version: process.version,
        platform: process.platform,
        publisher: 'jvnpackard@gmail.com',
        uname: null
    };
    this.USER_AGENT_SERIALIZED = null;
    this.setHost = function setHost(host, port, protocol) {
        self._setApiField('host', host);
        if (port) {
            self.setPort(port);
        }
        if (protocol) {
            self.setProtocol(protocol);
        }
    };
    this.setPort = function setPort(port) {
        self._setApiField('port', port.toLowerCase());
    };
    this.setProtocol = function setProtocol(protocol) {
        self._setApiField('protocol', protocol.toLowerCase());
    };
    this.setApiVersion = function (version) {
        if (version) {
            self._setApiField('version', version);
        }
    };
    this.setCache = function (cacheType, options) {
        switch (cacheType.toLowerCase()) {
            case 'file':
                self._cache = new self.cache.FileCache(options);
                break;
            case 'redis':
                self._cache = new self.cache.RedisCache(options);
                break;
            default:
                self._cache = new self.cache.MemoryCache();
        }
    };
    this.getCache = function () {
        return self._cache;
    };
    this.setApiKey = function (key) {
        if (key) {
            self._setApiField('keyID', key.keyID || key.keyid);
            self._setApiField('vCode', key.vCode || key.vcode);
        }
    };
    this.getApiKey = function (args) {
        var keyid = self.getApiField('keyID') || args.keyID || args.keyid, vcode = self.getApiField('vCode') || args.vCode || args.vcode;
        if (keyid && keyid != '' && vcode && vcode != '') {
            return { keyID: keyid, vCode: vcode };
        }
        return null;
    };
    this.setTimeout = function (timeout) {
        self._setApiField('timeout', timeout == null ? self.DEFAULT_TIMEOUT : timeout);
    };
    this.setHttpAgent = function (agent) {
        self._setApiField('agent', agent);
    };
    this._setApiField = function (key, value) {
        self._api[key] = value;
    };
    this.getApiField = function (key) {
        return self._api[key];
    };
    this.getConstant = function (c) {
        return EveClient[c];
    };
    this.getClientUserAgent = function getClientUserAgent(cb) {
        if (self.USER_AGENT_SERIALIZED) {
            return cb(self.USER_AGENT_SERIALIZED);
        }
        exec('uname -a', function (err, uname) {
            self.USER_AGENT.uname = uname || 'UNKNOWN';
            self.USER_AGENT_SERIALIZED = JSON.stringify(self.USER_AGENT);
            cb(self.USER_AGENT_SERIALIZED);
        });
    };
    this._prepResources = function _prepResources() {
        for (var name in resources) {
            self[name[0].toLowerCase() + name.substring(1)] = new resources[name](self);
        }
    }();
}
;
module.exports = new EveClient();
//# sourceMappingURL=EveClient.js.map