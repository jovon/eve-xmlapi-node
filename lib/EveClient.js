var utils = require('./utils');
var Promise = require('bluebird');
var Cache = require('./cache/cache');
var MemoryCache = require('./cache/memory');
var FileCache = require('./cache/file');
var RedisCache = require('./cache/redis');
var EveResource = require('./EveResource');
var packageJson = require('../package.json');
var DEFAULT_HOST = 'api.eveonline.com', DEFAULT_BASE_PATH = '', DEFAULT_API_VERSION = '2', DEFAULT_PORT = '443', DEFAULT_PROTOCOL = 'https', DEFAULT_TIMEOUT = require('http').createServer().timeout;
var resources = {
    CallList: require('./resources/CallList'),
    SkillQueue: require('./resources/SkillQueue'),
    CharacterID: require('./resources/CharacterID'),
    ServerStatus: require('./resources/ServerStatus'),
    Characters: require('./resources/Characters'),
    CharAccountBalance: require('./resources/CharAccountBalance'),
    AccountStatus: require('./resources/AccountStatus'),
    CharacterSheet: require('./resources/CharacterSheet'),
    ApiKeyInfo: require('./resources/APIKeyInfo'),
    CharAssetList: require('./resources/CharAssetList'),
    Blueprints: require('./resources/Blueprints'),
    CharBookmarks: require('./resources/CharBookmarks'),
    UpcomingCalendarEvents: require('./resources/UpcomingCalendarEvents')
};
var EveClient = (function () {
    function EveClient() {
        if (!(this instanceof EveClient)) {
            return new EveClient();
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
        this.EveResource = EveResource;
        this.cache = {};
        this.cache.Cache = Cache;
        this.cache.MemoryCache = MemoryCache;
        this.cache.FileCache = FileCache;
        this.cache.RedisCache = RedisCache;
        this._cache = new this.cache.MemoryCache();
        this.PACKAGE_VERSION = packageJson.version;
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
        if (key && key.keyID && key.vCode) {
            this._setApiField('keyID', key.keyID);
            this._setApiField('vCode', key.vCode);
            return null;
        }
        return new Error("setApiKey Error: ApiKey needs a keyID and vCode property.");
    };
    ;
    EveClient.prototype.getApiKey = function (args) {
        var keyid, vcode;
        if (utils.isKeyHash(args)) {
            keyid = args.keyID || args.keyid || args.keyId;
            vcode = args.vCode || args.vcode;
        }
        if (!keyid || !vcode) {
            keyid = this.getApiField('keyID');
            vcode = this.getApiField('vCode');
        }
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
    EveClient.prototype.getUserAgent = function () {
        return JSON.stringify(this.USER_AGENT);
    };
    ;
    EveClient.prototype.setUserAgent = function (ua) {
        this.USER_AGENT = ua;
    };
    ;
    EveClient.prototype._prepResources = function () {
        for (var name in resources) {
            var resourceMethod = name[0].toLowerCase() + name.substring(1);
            this[resourceMethod] = new resources[name](this);
            this[resourceMethod].fetchP = Promise.promisify(this[resourceMethod].fetch);
        }
    };
    ;
    return EveClient;
})();
;
module.exports = EveClient;
//# sourceMappingURL=EveClient.js.map