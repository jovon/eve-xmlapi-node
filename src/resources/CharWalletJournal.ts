import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../globals')
import _ = require('lodash')

class CharWalletJournal extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/WalletJournal.xml.aspx',
			cacheDuration: 1800000,
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
		this.requestParamProcessor = function(params: globals.Params, deferred: any): globals.Params {
			var results: globals.Params;
			if(params && params.accountKey && typeof params === 'object') {
				results.accountKey = params.accountKey
			}
			if(params && params.fromID && typeof params === 'object') {
				results.fromID = params.fromID
			}
			if(params && params.rowCount && typeof params === 'object') {
				results.rowCount = params.rowCount
			}
			return results
		}
	}	
}
export = CharWalletJournal