import utils = require('./utils')
import globals = require('../globals')

var exec = require('child_process').exec,
    DEFAULT_HOST = 'api.eveonline.com',
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


interface Resources {
  [key: string]: any
}


class EveClient implements globals.Client{
  USER_AGENT_SERIALIZED: any;
  _api: globals.Api;
  EveResource: any;
  cache: any;
  _cache: any;
  
  PACKAGE_VERSION: any;
  USER_AGENT: any;
  [key: string]: any;
  constructor(args?: any) {        
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
      dev: true,
    };  
    
    this.EveResource = require('./EveResource')  
    
    this.cache = {}  
    this.cache.Cache = require('./cache/cache')
    this.cache.MemoryCache = require('./cache/memory')
    this.cache.FileCache = require('./cache/file')
    this.cache.RedisCache = require('./cache/redis')
    this._cache = new this.cache.MemoryCache()    
        
    var version: string;
    if(args) {
      version = args['version'] || DEFAULT_API_VERSION
      this.USER_AGENT_SERIALIZED = args['User-Agent'] || null
      if(args['cache']) this.setCache(args['cache'])
    }    
    
    var packageJson = require('../package.json')
    this.PACKAGE_VERSION = packageJson.version;
    
    this.USER_AGENT = {
      client_version: this.PACKAGE_VERSION,
      lang: 'node',
      lang_version: process.version,
      platform: process.platform,
      publisher: 'jvnpackard@gmail.com',
      uname: null,
    };
    
    this._prepResources()
  }  
  

  setHost(host: string, port?: string, protocol?: string) {
    this._setApiField('host', host);
    if (port) {
      this.setPort(port);
    }
    if (protocol) {
      this.setProtocol(protocol);
    }
  };
  
  setPort(port: string) {
    this._setApiField('port', port.toLowerCase());
  };

  setProtocol(protocol: string) {
    this._setApiField('protocol', protocol.toLowerCase());
  };

  setApiVersion(version: string) {
    if (version) {
      this._setApiField('version', version);
    }
  };
  
  setCache(cacheType: string, options?: any) {
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
  };
  
  getCache() {
    return this._cache
  };
  
  // @param  {Object}   key   Eve Apikey with vCode and keyID properties
  setApiKey(key: any) {
    if (key) {      
        this._setApiField('keyID', key.keyID || key.keyid);     
        this._setApiField('vCode', key.vCode || key.vcode);      
    }
  };
  
  getApiKey(args: any): globals.EveKey {
    var keyid = this.getApiField('keyID') || args.keyID || args.keyid,
        vcode = this.getApiField('vCode') || args.vCode || args.vcode
    
    if(keyid && keyid != '' && vcode && vcode != '') {
      return {keyID: keyid, vCode: vcode}
    }
    return null
  };

  setTimeout(timeout: number) {
    var self = this
    this._setApiField(
      'timeout',
      timeout == null ? DEFAULT_TIMEOUT : timeout
    );
  };

  setHttpAgent(agent: any) {
    this._setApiField('agent', agent);
  };

  _setApiField(key: string, value: any) {
    this._api[key] = value;
  };

  getApiField(key: string) {
    return this._api[key];
  };
  
  getClientUserAgent(cb: Function) {    
    if (this.USER_AGENT_SERIALIZED) {
      return cb(this.USER_AGENT_SERIALIZED);
    }
    var self = this;
    exec('uname -a', function(err: Error, uname: string) {
      self.USER_AGENT.uname = uname || 'UNKNOWN';
      self.USER_AGENT_SERIALIZED = JSON.stringify(self.USER_AGENT);
      cb(self.USER_AGENT_SERIALIZED);
    });
  };
  
  setClientUserAgent(cua: string) {
    this.USER_AGENT = cua;
  };

  /*  
   * Make the first letter of the resource lowercase for the method
   */
  _prepResources() {
    for (var name in resources) {
      var resourceMethod: string = name[0].toLowerCase() + name.substring(1)  // (i.e. change ServerStatus to serverStatus)
      this[resourceMethod] = new resources[name](this);                       // make the resource a method on EveClient
    }
  };

};

export = EveClient;