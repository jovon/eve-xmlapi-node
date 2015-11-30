import Cache = require('./cache');
export = FileCache;
declare class FileCache extends Cache {
    private _path;
    private _prefix;
    constructor(options?: any);
    setPath(p: string): void;
    getPath(): string;
    setPrefix(prefix: string): void;
    getPrefix(): string;
    getFilePath(key: string): string;
    clear(cb: Function): void;
    makeDirs(dir: string, cb: Function): void;
    write: (key: string, value: string, duration: number, cb: Function) => void;
    expireTime(duration: number): number;
    read: (key: string, cb: Function) => void;
}
