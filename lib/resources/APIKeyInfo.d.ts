import Resource = require('../EveResource');
declare class APIKeyInfo extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = APIKeyInfo;
