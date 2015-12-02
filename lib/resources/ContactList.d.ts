import Resource = require('../EveResource');
declare class ContactList extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ContactList;
