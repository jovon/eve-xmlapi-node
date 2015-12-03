import Resource = require('../EveResource');
declare class CharacterInfo extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharacterInfo;
