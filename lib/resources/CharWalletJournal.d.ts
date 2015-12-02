import Resource = require('../EveResource');
declare class CharWalletJournal extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharWalletJournal;
