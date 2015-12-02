import Resource = require('../EveResource');
declare class CharAssetList extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharAssetList;
