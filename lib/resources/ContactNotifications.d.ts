import Resource = require('../EveResource');
declare class ContactNotifications extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ContactNotifications;
