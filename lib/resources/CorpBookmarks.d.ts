import Resource = require('../EveResource');
declare class CorpBookmarks extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CorpBookmarks;
