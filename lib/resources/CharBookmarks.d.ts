import Resource = require('../EveResource');
declare class CharBookmarks extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CharBookmarks;
