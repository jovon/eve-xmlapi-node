import Resource = require('../EveResource');
declare class CharacterAffiliation extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharacterAffiliation;
