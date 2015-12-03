import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../globals')

class ContractItems extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/ContractItems.xml.aspx',
			cacheDuration: 990000000000000000000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
		this.requestParamProcessor = function(params: globals.Params, deferred: any): globals.Params {
			if(params && params.contractID && typeof params === 'object') {
				return {contractID: params.contractID}
			}
			return deferred.reject(new Error.EveInvalidRequestError(
				{message: "ContractItems requires a contractID"}
				))
		}
	}
}
export = ContractItems