import Resource = require('../EveResource');
declare class CharacterSheet extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharacterSheet;
