import Resource = require('../EveResource');
declare class SkillQueue extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = SkillQueue;
