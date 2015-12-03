import Resource = require('../EveResource');
declare class FacWarSystems extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = FacWarSystems;
