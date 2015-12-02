import globals = require('../globals');
export = utils;
declare var utils: {
    isKeyHash: (o: any) => any;
    isObject: (o: any) => boolean;
    formatRequestParams(self: any, data: any, deferred: any): string;
    keyVCodeProcessor(self: any, params: globals.Params, deferred: any): globals.Params;
    keyVCodeCharIDProcessor(self: any, params: globals.Params, deferred: any): globals.Params;
    stringifyRequestData: (data: any) => string;
    getDataFromArgs: (args: any) => any;
    getKeyFromArgs: (args: any) => globals.EveKey;
    protoExtend: (sub: any) => any;
};
