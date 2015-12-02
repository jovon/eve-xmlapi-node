import Resource = require('../EveResource');
declare class MailingLists extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = MailingLists;
