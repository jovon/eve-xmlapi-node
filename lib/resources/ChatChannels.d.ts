import Resource = require('../EveResource');
declare class ChatChannels extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = ChatChannels;
