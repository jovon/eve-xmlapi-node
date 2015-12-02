import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../../globals')

class AllianceList extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/eve/AllianceList.xml.aspx',
			cacheDuration: 3600000,			
		})
		this.requestParamProcessor = function(params: globals.Params, deferred: any): globals.Params {
			if(params && params.version && typeof params === 'object') {
				return {version: params.version}
			}
			return null
		}
	}
}
export = AllianceList