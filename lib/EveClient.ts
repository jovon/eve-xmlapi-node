import utils = require('./utils')

var exec = require('child_process').exec,
    DEFAULT_HOST = 'api.testeveonline.com',
    DEFAULT_BASE_PATH = '',
    DEFAULT_API_VERSION = '2',
    DEFAULT_PORT = '443',
    DEFAULT_PROTOCOL = 'https',
    DEFAULT_TIMEOUT = require('http').createServer().timeout;

var resources: Resources = {
  CallList: require('./resources/CallList'),
  SkillQueue: require('./resources/SkillQueue'),
  CharacterID: require('./resources/CharacterID'),
  ServerStatus: require('./resources/ServerStatus'),
  Characters: require('./resources/Characters')
}

var api: Api = {
    auth: null,
    host: DEFAULT_HOST,
    basePath: DEFAULT_BASE_PATH,
    version: '',
    timeout: DEFAULT_TIMEOUT,
    port: DEFAULT_PORT,
    protocol: DEFAULT_PROTOCOL,
    agent: null,
    dev: true,
  };

interface Client {
  _api: Api;
  [key: string]: any;
}

interface Resources {
  [key: string]: any
}


function EveClient(args?: any): any {
  var version = ''
      , cache = ''
      , self = this;
          
  if (!(this instanceof EveClient)) {
    return new EveClient(args);
  }
    
  this.USER_AGENT_SERIALIZED = null;
  
  this._api = api;  
  
  this.EveResource = require('./EveResource')  
  
  this.cache = {}  
  this.cache.Cache = require('./cache/cache')
  this.cache.MemoryCache = require('./cache/memory')
  this.cache.FileCache = require('./cache/file')
  this.cache.RedisCache = require('./cache/redis')
  this._cache = new this.cache.MemoryCache()
  
  this.DEFAULT_HOST = DEFAULT_HOST;
  this.DEFAULT_BASE_PATH = DEFAULT_BASE_PATH;
  this.DEFAULT_API_VERSION = DEFAULT_API_VERSION;
  this.DEFAULT_PORT = DEFAULT_PORT;
  this.DEFAULT_PROTOCOL = DEFAULT_PROTOCOL;
  
  if(args) {
    version = args['version'] || this.DEFAULT_API_VERSION
    this.USER_AGENT_SERIALIZED = args['User-Agent'] || null
    if(args['cache']) this.setCache(args['cache'])
  }
  
  this.DEFAULT_TIMEOUT = require('http').createServer().timeout;
  
  var packageJson = require('../package.json')
  this.PACKAGE_VERSION = packageJson.version;
  
  this.USER_AGENT = {
    client_version: self.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'jvnpackard@gmail.com',
    uname: null,
  };
  
  this._prepResources()
}  
  
EveClient.prototype = {
  setHost: function setHost(host: string, port?: string, protocol?: string) {
    this._setApiField('host', host);
    if (port) {
      this.setPort(port);
    }
    if (protocol) {
      this.setProtocol(protocol);
    }
  },
  
  setPort: function setPort(port: string) {
    this._setApiField('port', port.toLowerCase());
  },

  setProtocol: function setProtocol(protocol: string) {
    this._setApiField('protocol', protocol.toLowerCase());
  },

  setApiVersion: function setApiVersion(version: string) {
    if (version) {
      this._setApiField('version', version);
    }
  },
  
  setCache: function setCache(cacheType: string, options: any) {
    if(cacheType) {
      switch (cacheType.toLowerCase()) {
        case 'file':
          this._cache = new this.cache.FileCache(options)
          break;
        case 'redis':
          this._cache = new this.cache.RedisCache(options)
          break;
        default:
          this._cache = new this.cache.MemoryCache()        
      }
    }
  },
  
  getCache: function getCache() {
    return this._cache
  },
  
  // @param  {Object}   key   Eve Apikey with vCode and keyID properties
  setApiKey: function setApiKey(key: any) {
    if (key) {      
        this._setApiField('keyID', key.keyID || key.keyid);     
        this._setApiField('vCode', key.vCode || key.vcode);      
    }
  },
  
  getApiKey: function getApiKey(args: any): EveKey {
    var keyid = this.getApiField('keyID') || args.keyID || args.keyid,
        vcode = this.getApiField('vCode') || args.vCode || args.vcode
    
    if(keyid && keyid != '' && vcode && vcode != '') {
      return {keyID: keyid, vCode: vcode}
    }
    return null
  },

  setTimeout: function setTimeout(timeout: number) {
    var self = this
    this._setApiField(
      'timeout',
      timeout == null ? self.DEFAULT_TIMEOUT : timeout
    );
  },

  setHttpAgent: function setHttpAgent(agent: any) {
    this._setApiField('agent', agent);
  },

  _setApiField: function _setApiField(key: string, value: string) {
    this._api[key] = value;
  },

  getApiField: function getApiField(key: string) {
    return this._api[key];
  },

  getConstant: function getConstant(c: string) {
    return this[c];
  },

  getClientUserAgent: function getClientUserAgent(cb: Function) {    
    if (this.USER_AGENT_SERIALIZED) {
      return cb(this.USER_AGENT_SERIALIZED);
    }
    var self = this;
    exec('uname -a', function(err: Error, uname: string) {
      self.USER_AGENT.uname = uname || 'UNKNOWN';
      self.USER_AGENT_SERIALIZED = JSON.stringify(self.USER_AGENT);
      cb(self.USER_AGENT_SERIALIZED);
    });
  },
  
  setClientUserAgent: function setClientUserAgent(cua: string) {
    this.USER_AGENT = cua;
  },

  /*  
   * Make the first letter of the resource lowercase for the method
   */
  _prepResources: function _prepResources() {
    var self = this    
    for (var name in resources) {
      self[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](self);
    }
  },

};

module.exports = EveClient;