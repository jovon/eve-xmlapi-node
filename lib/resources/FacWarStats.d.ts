import Resource = require('../EveResource');
declare class FacWarStats extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = FacWarStats;
