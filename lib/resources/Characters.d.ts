import Resource = require('../EveResource');
declare class Characters extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Characters;
