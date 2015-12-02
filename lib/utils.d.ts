import globals = require('../globals');
import Promise = require('bluebird');
export = utils;
declare var utils: {
    isKeyHash: (o: any) => any;
    isObject: (o: any) => boolean;
    keyVCodeProcessor(self: any, params: globals.Params, deferred: Promise.Resolver<Error>): globals.Params;
    keyVCodeCharIDProcessor(self: any, params: globals.Params, deferred: Promise.Resolver<Error>): globals.Params;
    stringifyRequestData: (data: any) => string;
    getDataFromArgs: (args: any) => any;
    getKeyFromArgs: (args: any) => globals.EveKey;
    protoExtend: (sub: any) => any;
};
