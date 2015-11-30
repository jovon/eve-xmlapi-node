import globals = require('../globals');
declare class EveClient implements globals.Client {
    USER_AGENT_SERIALIZED: any;
    _api: globals.Api;
    EveResource: any;
    cache: any;
    _cache: any;
    PACKAGE_VERSION: any;
    USER_AGENT: any;
    [key: string]: any;
    constructor(args?: any);
    setHost(host: string, port?: string, protocol?: string): void;
    setPort(port: string): void;
    setProtocol(protocol: string): void;
    setApiVersion(version: string): void;
    setCache(cacheType: string, options?: any): void;
    getCache(): any;
    setApiKey(key: any): void;
    getApiKey(args: any): globals.EveKey;
    setTimeout(timeout: number): void;
    setHttpAgent(agent: any): void;
    _setApiField(key: string, value: any): void;
    getApiField(key: string): any;
    getClientUserAgent(cb: Function): any;
    setClientUserAgent(cua: string): void;
    _prepResources(): void;
}
export = EveClient;
