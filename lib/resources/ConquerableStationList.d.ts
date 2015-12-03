import Resource = require('../EveResource');
declare class ConquerableStationList extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ConquerableStationList;
