import Resource = require('../EveResource');
declare class Contracts extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Contracts;
