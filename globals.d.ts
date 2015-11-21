import http = require('http')

interface Options {
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

interface Headers {
  'Accept': string;
  'Content-Type': string;
  'Content-Length': number;
  'User-Agent': string;
  'EveApi-Version': string;
  'X-Client-User-Agent': string;
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
 
 interface ClientUserAgent {
	client_version: string,
	lang: string,
	lang_version: string,
	platform: string,
	publisher: string,
	uname?: string,
 }
 
 interface Spec {
   method: string;
   path: string;
   cacheDuration: number;
   secured?: boolean;
   requestParamProcessor?: (self: any, method: string, params: any, cb: Function)=>any;
 }
 
interface EveKey {
  keyID: string;
  vCode: string;
  characterID?: string;
}
 
interface Cache {
  write(key: string, value: string, duration: number, cb: Function): string;
  read(key: string, cb: Function): string;
}