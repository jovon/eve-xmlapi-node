import Resource = require('../EveResource');
declare class Jumps extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Jumps;
