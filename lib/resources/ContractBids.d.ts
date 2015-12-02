import Resource = require('../EveResource');
declare class ContractBids extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ContractBids;
