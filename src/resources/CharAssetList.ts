import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../globals')

class CharAssetList extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/AssetList.xml.aspx',
			cacheDuration: 7200000,			
		})
		this.authParamProcessor = utils.keyVCodeCharIDProcessor
		this.requestParamProcessor = function(params: globals.Params, deferred: any): any {
			if(params && params.flat && typeof params === 'object') {
				return {flat: params.flat}
			}
			return null
		}
	}
}
export = CharAssetList