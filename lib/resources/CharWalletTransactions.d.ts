import Resource = require('../EveResource');
declare class CharWalletTransactions extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharWalletTransactions;
