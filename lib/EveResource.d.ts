import http = require('http');
import Promise = require('bluebird');
import globals = require('../globals');
declare class EveResource {
    _eve: any;
    private initialize;
    extend: Function;
    method: Function;
    path: string;
    overrideHost: string;
    constructor(eve: any);
    requestParamProcessor: Function;
    createFullPath(requestPath: string, params: string): string;
    createDeferred(callback: Function): Promise.Resolver<{}>;
    _timeoutHandler(timeout: number, req: globals.ClientReq, callback: Function): () => void;
    _responseHandler(req: globals.ClientReq, callback: Function): (res: http.ClientResponse) => void;
    _errorHandler(req: globals.ClientReq, callback: Function): (error: Error) => void;
    _request(method: string, path: string, params: string, options: any, callback: Function): void;
}
export = EveResource;
