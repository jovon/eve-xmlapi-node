import Resource = require('../EveResource');
declare class CalendarEventAttendees extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = CalendarEventAttendees;
