import Resource = require('../EveResource');
declare class CharAccountBalance extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharAccountBalance;
