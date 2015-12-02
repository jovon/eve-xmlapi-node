import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../../globals')

class CalendarEventAttendees extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/CalendarEventAttendees.xml.aspx',
			cacheDuration: 600000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
		this.requestParamProcessor = function(params: globals.Params, deferred: any): any {
			if(params && params.eventIDs && typeof params === 'object') {
				return {eventIDs: params.eventIDs}
			}
			return deferred.reject(new Error.EveInvalidRequestError({message: "CalendarEventAttendees requires an eventIDs property.  The eventID can be obtained from the UpcomingCalendarEvents path."}))
		}
	}
}
export = CalendarEventAttendees