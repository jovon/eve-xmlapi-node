var exec = require('child_process').exec, DEFAULT_HOST = 'api.eveonline.com', DEFAULT_BASE_PATH = '', DEFAULT_API_VERSION = '2', DEFAULT_PORT = '443', DEFAULT_PROTOCOL = 'https', DEFAULT_TIMEOUT = require('http').createServer().timeout;
var resources = {
    CallList: require('./resources/CallList'),
    SkillQueue: require('./resources/SkillQueue'),
    CharacterID: require('./resources/CharacterID'),
    ServerStatus: require('./resources/ServerStatus'),
    Characters: require('./resources/Characters')
};
var EveClient = (function () {
    function EveClient(args) {
        if (!(this instanceof EveClient)) {
            return new EveClient(args);
        }
        this._api = {
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
        this.EveResource = require('./EveResource');
        this.cache = {};
        this.cache.Cache = require('./cache/cache');
        this.cache.MemoryCache = require('./cache/memory');
        this.cache.FileCache = require('./cache/file');
        this.cache.RedisCache = require('./cache/redis');
        this._cache = new this.cache.MemoryCache();
        var version;
        if (args) {
            version = args['version'] || DEFAULT_API_VERSION;
            this.USER_AGENT_SERIALIZED = args['User-Agent'] || null;
            if (args['cache'])
                this.setCache(args['cache']);
        }
        var packageJson = require('../package.json');
        this.PACKAGE_VERSION = packageJson.version;
        this.USER_AGENT = {
            client_version: this.PACKAGE_VERSION,
            lang: 'node',
            lang_version: process.version,
            platform: process.platform,
            publisher: 'jvnpackard@gmail.com',
            uname: null
        };
        this._prepResources();
    }
    EveClient.prototype.setHost = function (host, port, protocol) {
        this._setApiField('host', host);
        if (port) {
            this.setPort(port);
        }
        if (protocol) {
            this.setProtocol(protocol);
        }
    };
    ;
    EveClient.prototype.setPort = function (port) {
        this._setApiField('port', port.toLowerCase());
    };
    ;
    EveClient.prototype.setProtocol = function (protocol) {
        this._setApiField('protocol', protocol.toLowerCase());
    };
    ;
    EveClient.prototype.setApiVersion = function (version) {
        if (version) {
            this._setApiField('version', version);
        }
    };
    ;
    EveClient.prototype.setCache = function (cacheType, options) {
        if (cacheType) {
            switch (cacheType.toLowerCase()) {
                case 'file':
                    this._cache = new this.cache.FileCache(options);
                    break;
                case 'redis':
                    this._cache = new this.cache.RedisCache(options);
                    break;
                default:
                    this._cache = new this.cache.MemoryCache();
            }
        }
    };
    ;
    EveClient.prototype.getCache = function () {
        return this._cache;
    };
    ;
    EveClient.prototype.setApiKey = function (key) {
        if (key) {
            this._setApiField('keyID', key.keyID || key.keyid);
            this._setApiField('vCode', key.vCode || key.vcode);
        }
    };
    ;
    EveClient.prototype.getApiKey = function (args) {
        var keyid = this.getApiField('keyID') || args.keyID || args.keyid, vcode = this.getApiField('vCode') || args.vCode || args.vcode;
        if (keyid && keyid != '' && vcode && vcode != '') {
            return { keyID: keyid, vCode: vcode };
        }
        return null;
    };
    ;
    EveClient.prototype.setTimeout = function (timeout) {
        var self = this;
        this._setApiField('timeout', timeout == null ? DEFAULT_TIMEOUT : timeout);
    };
    ;
    EveClient.prototype.setHttpAgent = function (agent) {
        this._setApiField('agent', agent);
    };
    ;
    EveClient.prototype._setApiField = function (key, value) {
        this._api[key] = value;
    };
    ;
    EveClient.prototype.getApiField = function (key) {
        return this._api[key];
    };
    ;
    EveClient.prototype.getClientUserAgent = function (cb) {
        if (this.USER_AGENT_SERIALIZED) {
            return cb(this.USER_AGENT_SERIALIZED);
        }
        var self = this;
        exec('uname -a', function (err, uname) {
            self.USER_AGENT.uname = uname || 'UNKNOWN';
            self.USER_AGENT_SERIALIZED = JSON.stringify(self.USER_AGENT);
            cb(self.USER_AGENT_SERIALIZED);
        });
    };
    ;
    EveClient.prototype.setClientUserAgent = function (cua) {
        this.USER_AGENT = cua;
    };
    ;
    EveClient.prototype._prepResources = function () {
        for (var name in resources) {
            var resourceMethod = name[0].toLowerCase() + name.substring(1);
            this[resourceMethod] = new resources[name](this);
        }
    };
    ;
    return EveClient;
})();
;
module.exports = EveClient;
//# sourceMappingURL=EveClient.js.map