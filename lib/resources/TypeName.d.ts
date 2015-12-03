import Resource = require('../EveResource');
declare class TypeName extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = TypeName;
