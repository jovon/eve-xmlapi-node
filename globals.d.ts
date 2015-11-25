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
  'EveApi-Version': string;
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
	agent?: ClientUserAgent;
	dev?: boolean;
  [key: string]: any;
 }
 
export interface ClientUserAgent {
	client_version: string,
	lang: string,
	lang_version: string,
	platform: string,
	publisher: string,
	uname?: string,
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
 
