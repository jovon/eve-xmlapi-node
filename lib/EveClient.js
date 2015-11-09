'use strict';

EveClient.cache = {}
EveClient.cache.Cache = require('./cache/cache')
EveClient.cache.MemoryCache = require('./cache/memory')
EveClient.cache.FileCache = require('./cache/file')

EveClient.DEFAULT_HOST = 'api.testeveonline.com';
EveClient.DEFAULT_BASE_PATH = '';
EveClient.DEFAULT_API_VERSION = '2'
EveClient.DEFAULT_PORT = '443'
EveClient.DEFAULT_PROTOCOL = 'https'

EveClient.DEFAULT_TIMEOUT = require('http').createServer().timeout;

EveClient.PACKAGE_VERSION = require('../package.json').version;

EveClient.USER_AGENT = {
	client_version: EveClient.PACKAGE_VERSION,
	lang: 'node',
	lang_version: process.version,
	platform: process.platform,
	publisher: 'jvnpackard@gmail.com',
	uname: null,
};

EveClient.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
  CallList: require('./resources/CallList'),
  SkillQueue: require('./resources/SkillQueue'),
  CharacterID: require('./resources/CharacterID'),
  ServerStatus: require('./resources/ServerStatus')
}

function EveClient(args) {
  var version, cache = '';
  if (!(this instanceof EveClient)) {
    return new EveClient(args);
  }
  if(args) {
    version = args['version'] || EveClient.DEFAULT_API_VERSION
    this.USER_AGENT_SERIALIZED = args['User-Agent'] || null
    if(args['cache']) cache = args['cache'] 
  }
    
  this._api = {
    auth: null,
    host: EveClient.DEFAULT_HOST,
    basePath: EveClient.DEFAULT_BASE_PATH,
    version: version,
    timeout: EveClient.DEFAULT_TIMEOUT,
    port: EveClient.DEFAULT_PORT,
    protocol: EveClient.DEFAULT_PROTOCOL,
    agent: null,
    dev: true,
  };
  
  this.cache = new EveClient.cache.MemoryCache()

  this._prepResources();  
  this.setApiVersion(version);
}

EveClient.prototype = {

  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if (port) {
      this.setPort(port);
    }
    if (protocol) {
      this.setProtocol(protocol);
    }
  },
  
  setPort: function(port) {
    this._setApiField('port', port.toLowerCase());
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol.toLowerCase());
  },

  setApiVersion: function(version) {
    if (version) {
      this._setApiField('version', version);
    }
  },
  
  setCache: function(cacheType, options) {
    switch (cacheType.toLowerCase()) {
      case 'file':
        this._cache = new EveClient.cache.FileCache(options)
        break;
      default:
        this._cache = new EveClient.cache.MemoryCache()        
    }
  },
  
  getCache: function() {
    return this._cache || new EveClient.cache.MemoryCache()
  },

  setApiKey: function(key) {
    if (key && key != {}) {
      if (key.keyid && key.vcode) {
        this._setApiField(
          'keyID',
          key.keyid
        );
     
        this._setApiField(
          'vCode',
          key.vcode
        );
      }
    }
  },

  setTimeout: function(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? EveClient.DEFAULT_TIMEOUT : timeout
    );
  },

  setHttpAgent: function(agent) {
    this._setApiField('agent', agent);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return EveClient[c];
  },

  getClientUserAgent: function(cb) {
    if (EveClient.USER_AGENT_SERIALIZED) {
      return cb(EveClient.USER_AGENT_SERIALIZED);
    }
    exec('uname -a', function(err, uname) {
      EveClient.USER_AGENT.uname = uname || 'UNKNOWN';
      EveClient.USER_AGENT_SERIALIZED = JSON.stringify(EveClient.USER_AGENT);
      cb(EveClient.USER_AGENT_SERIALIZED);
    });
  },

  /*  
   * Make the first letter of the resource lowercase for the method
   */
  _prepResources: function() {
    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  },

};

module.exports = EveClient;