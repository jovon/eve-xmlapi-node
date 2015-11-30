import Cache = require('./cache');
export = RedisCache;
declare class RedisCache extends Cache {
    private _port;
    private _host;
    private _client;
    constructor(options?: any);
    clear(cb: Function): void;
    write: (key: string, value: string, duration: number, cb: Function) => void;
    read: (key: string, cb: Function) => void;
}
