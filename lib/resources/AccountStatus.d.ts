import Resource = require('../EveResource');
declare class AccountStatus extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = AccountStatus;
