import utils = require('./utils')
import globals = require('./globals')
import Promise = require('bluebird')
import Cache = require('./cache/cache')
import MemoryCache = require('./cache/memory')
import FileCache = require('./cache/file')
import RedisCache = require('./cache/redis')
import EveResource = require('./EveResource')
var packageJson = require('../package.json')

var DEFAULT_HOST = 'api.eveonline.com',
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
  Characters: require('./resources/Characters'),
  CharAccountBalance: require('./resources/CharAccountBalance'),
  CorpAccountBalance: require('./resources/CorpAccountBalance'),
  AccountStatus: require('./resources/AccountStatus'),
  CharacterSheet: require('./resources/CharacterSheet'),
  ApiKeyInfo: require('./resources/APIKeyInfo'),
  CharAssetList: require('./resources/CharAssetList'),
  Blueprints: require('./resources/Blueprints'),
  CharBookmarks: require('./resources/CharBookmarks'),
  CorpBookmarks: require('./resources/CharBookmarks'),
  UpcomingCalendarEvents: require('./resources/UpcomingCalendarEvents'),
  CalendarEventAttendees: require('./resources/CalendarEventAttendees'),
  ChatChannels: require('./resources/ChatChannels'),
  ContactList: require('./resources/ContactList'),
  ContactNotifications: require('./resources/ContactNotifications'),
  ContractBids: require('./resources/ContractBids'),
  Contracts: require('./resources/Contracts'),
  ContractItems: require('./resources/ContractItems'),
  FacWarStats: require('./resources/FacWarStats'),
  MailingLists: require('./resources/MailingLists'),
  MailMessages: require('./resources/MailMessages'),
  MarketOrders: require('./resources/MarketOrders'),
  CharWalletJournal: require('./resources/CharWalletJournal'),
  CharWalletTransactions: require('./resources/CharWalletTransactions'),
  CorpWalletJournal: require('./resources/CorpWalletJournal'),
  CorpWalletTransactions: require('./resources/CorpWalletTransactions'),
  AllianceList: require('./resources/AllianceList'),
  CharacterAffiliation: require('./resources/CharacterAffiliation'),
  CharacterInfo: require('./resources/CharacterInfo'),
  CharacterName: require('./resources/CharacterName'),
  ConquerableStationList: require('./resources/ConquerableStationList'),
  ErrorList: require('./resources/ErrorList'),
  RefTypes: require('./resources/RefTypes'),
  TypeName: require('./resources/TypeName'),
  
  // Map Resources
  FacWarSystems: require('./resources/FacWarSystems'),
  Jumps: require('./resources/Jumps'),
  Kills: require('./resources/Kills'),
  Sovereignty: require('./resources/Sovereignty')
}

interface Resources {
  [key: string]: any
}

class EveClient implements globals.Client{
    _api: globals.Api;
    EveResource: any;
    cache: any;       
    PACKAGE_VERSION: any;
    private _cache: any;
    private USER_AGENT: any;
    [key: string]: any;
    constructor() {
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
        dev: true,
      };  
      
      this.EveResource = EveResource  
      
      this.cache = {}  
      this.cache.Cache = Cache
      this.cache.MemoryCache = MemoryCache
      this.cache.FileCache = FileCache
      this.cache.RedisCache = RedisCache
      this._cache = new this.cache.MemoryCache()          
            
      
      this.PACKAGE_VERSION = packageJson.version;
            
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
    setApiKey(key: globals.EveKey): Error {
      if (key && key.keyID && key.vCode) {
          this._setApiField('keyID', key.keyID);     
          this._setApiField('vCode', key.vCode);
          return null
      }
      return new Error("setApiKey Error: ApiKey needs a keyID and vCode property.")
    };
    
    getApiKey(args?: any): globals.EveKey {
      var keyid: string, vcode: string;
      if (utils.isKeyHash(args)) {
        keyid = args.keyID || args.keyid || args.keyId
        vcode = args.vCode || args.vcode
      } 
      if(!keyid || !vcode) {
        keyid = this.getApiField('keyID')
        vcode = this.getApiField('vCode')
      }
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
    
    getUserAgent(): string {      
      return JSON.stringify(this.USER_AGENT)      
    };
    
    setUserAgent(ua: any) {
      this.USER_AGENT = ua;
    };
  
    
    _prepResources() {
      for (var name in resources) {
        // change to camelcase (i.e. change ServerStatus to serverStatus)
        var resourceMethod: string = name[0].toLowerCase() + name.substring(1)
        // make the resource a method on EveClient 
        this[resourceMethod] = new resources[name](this);
        // add Promise method
        this[resourceMethod].fetchP = Promise.promisify(this[resourceMethod].fetch)
      }
    };
  
  };

export = EveClient;