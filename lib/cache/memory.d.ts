import Cache = require('./cache');
export = MemoryCache;
declare class MemoryCache extends Cache {
    write: (key: string, value: string, duration: number, cb: Function) => void;
    read: (key: string, cb: Function) => void;
    private _cache;
    constructor();
    getCurrentTime(): number;
}
