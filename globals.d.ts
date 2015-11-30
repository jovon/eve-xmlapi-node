import http = require('http')

export interface Options {
        protocol?: string;
        host?: string;
        hostname?: string;
        family?: number;
        port?: number
        localAddress?: string;
        socketPath?: string;
        method?: string;
        path?: string;
        headers?: Headers;
        auth?: string;
        agent?: http.Agent;
    }

export interface Headers {
  'Accept': string;
  'Content-Type': string;
  'Content-Length': number;
  'User-Agent': string;
  'Client-Version': string;
  'X-Client-User-Agent': string;
  [key: string]: any
}
 
export interface Api {
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

export interface Spec {
   method: string;
   path: string;
   cacheDuration: number;
   secured?: boolean;
   requestParamProcessor?: (self: any, method: string, params: any, cb: Function)=>any;
}
 
export interface EveKey {
  keyID: string;
  vCode: string;
  characterID?: string;
}

export interface ClientReq extends http.ClientRequest{
  _isAborted?: boolean;
}

export interface Client {
  _api: Api;
  cache: any;
  setUserAgent: (ua: any)=>void;
  [key: string]: any;
}