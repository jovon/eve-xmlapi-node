import Resource = require('../EveResource');
declare class UpcomingCalendarEvents extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = UpcomingCalendarEvents;
