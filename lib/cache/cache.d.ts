export = Cache;
declare class Cache {
    write: (key: string, value: string, duration: number, cb: Function) => void;
    read: (key: string, cb: Function) => void;
    getCurrentTime(): number;
}
