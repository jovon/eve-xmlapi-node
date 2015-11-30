import Resource = require('../EveResource');
declare class CharacterID extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharacterID;
