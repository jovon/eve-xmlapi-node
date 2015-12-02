import globals = require('../globals');
declare class EveClient implements globals.Client {
    _api: globals.Api;
    EveResource: any;
    cache: any;
    PACKAGE_VERSION: any;
    private _cache;
    private USER_AGENT;
    [key: string]: any;
    constructor();
    setHost(host: string, port?: string, protocol?: string): void;
    setPort(port: string): void;
    setProtocol(protocol: string): void;
    setApiVersion(version: string): void;
    setCache(cacheType: string, options?: any): void;
    getCache(): any;
    setApiKey(key: globals.EveKey): Error;
    getApiKey(args?: any): globals.EveKey;
    setTimeout(timeout: number): void;
    setHttpAgent(agent: any): void;
    _setApiField(key: string, value: any): void;
    getApiField(key: string): any;
    getUserAgent(): string;
    setUserAgent(ua: any): void;
    _prepResources(): void;
}
export = EveClient;
