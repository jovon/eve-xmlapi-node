import Resource = require('../EveResource');
declare class RefTypes extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = RefTypes;
