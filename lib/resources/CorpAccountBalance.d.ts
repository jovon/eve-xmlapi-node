import Resource = require('../EveResource');
declare class CorpAccountBalance extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CorpAccountBalance;
