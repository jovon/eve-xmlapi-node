import Resource = require('../EveResource');
declare class Blueprints extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Blueprints;
