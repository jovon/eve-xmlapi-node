import Resource = require('../EveResource');
declare class CharacterName extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharacterName;
