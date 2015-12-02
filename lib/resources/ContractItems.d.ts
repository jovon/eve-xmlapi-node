import Resource = require('../EveResource');
declare class ContractItems extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ContractItems;
