import Resource = require('../EveResource');
declare class MailMessages extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = MailMessages;
