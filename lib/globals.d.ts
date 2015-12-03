import http = require('http');
declare module globals {
    interface Options {
        protocol?: string;
        host?: string;
        hostname?: string;
        family?: number;
        port?: number;
        localAddress?: string;
        socketPath?: string;
        method?: string;
        path?: string;
        headers?: Headers;
        auth?: string;
        agent?: http.Agent;
    }
    interface Headers {
        'Accept': string;
        'Content-Type': string;
        'Content-Length': number;
        'User-Agent': string;
        'Client-Version': string;
        'X-Client-User-Agent': string;
        [key: string]: any;
    }
    interface Api {
        auth?: string;
        host: string;
        basePath: string;
        version: string;
        timeout: number;
        port: string;
        protocol: string;
        agent?: any;
        dev?: boolean;
        [key: string]: any;
    }
    interface Spec {
        method: string;
        path: string;
        cacheDuration: number;
        secured?: boolean;
    }
    interface EveKey {
        keyID: string;
        vCode: string;
    }
    interface ClientReq extends http.ClientRequest {
        _isAborted?: boolean;
    }
    interface Client {
        _api: Api;
        cache: any;
        setUserAgent: (ua: any) => void;
        [key: string]: any;
    }
    interface Params {
        keyID?: string;
        vCode?: string;
        characterID?: (string | number);
        flat?: boolean;
        eventIDs?: Array<string | number>;
        contractID?: (string | number);
        orderID?: (string | number);
        accountKey?: (string | number);
        fromID?: (string | number);
        rowCount?: (string | number);
        version?: (string | number);
        ids?: any;
        names?: any;
    }
}
export = globals;
