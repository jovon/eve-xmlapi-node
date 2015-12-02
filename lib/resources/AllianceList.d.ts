import Resource = require('../EveResource');
declare class AllianceList extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = AllianceList;
