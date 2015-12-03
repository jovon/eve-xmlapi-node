import Resource = require('../EveResource');
declare class Kills extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = Kills;
