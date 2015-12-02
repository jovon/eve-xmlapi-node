import Resource = require('../EveResource');
declare class CorpWalletTransactions extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CorpWalletTransactions;
