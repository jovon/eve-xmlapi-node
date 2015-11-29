import Resource = require('../EveResource');
declare class ServerStatus extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ServerStatus;
