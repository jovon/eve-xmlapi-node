'use strict';

EveClient.DEFAULT_HOST = 'api.testeveonline.com';
EveClient.DEFAULT_BASE_PATH = '';
EveClient.DEFAULT_API_VERSION = '2'
EveClient.DEFAULT_PORT = '443'
EveClient.DEFAULT_PROTOCOL = 'https'

EveClient.DEFAULT_TIMEOUT = require('http').createServer().timeout;

EveClient.PACKAGE_VERSION = require('../package.json').version;

EveClient.USER_AGENT = {
	bindings_version: EveClient.PACKAGE_VERSION,
	lang: 'node',
	lang_version: process.version,
	platform: process.platform,
	publisher: 'EveClient',
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

function EveClient(version) {
  if (!(this instanceof EveClient)) {
    return new EveClient(version);
  }

  this._api = {
    auth: null,
    host: EveClient.DEFAULT_HOST,
    basePath: EveClient.DEFAULT_BASE_PATH,
    version: EveClient.DEFAULT_API_VERSION,
    timeout: EveClient.DEFAULT_TIMEOUT,
    port: EveClient.DEFAULT_PORT,
    protocol: EveClient.DEFAULT_PROTOCOL,
    agent: null,
    dev: true,
  };

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