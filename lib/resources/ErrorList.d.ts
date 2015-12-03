import Resource = require('../EveResource');
declare class ErrorList extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ErrorList;
