import Resource = require('../EveResource');
declare class Sovereignty extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Sovereignty;
