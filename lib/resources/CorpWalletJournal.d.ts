import Resource = require('../EveResource');
declare class CorpWalletJournal extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CorpWalletJournal;
