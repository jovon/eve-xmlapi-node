import Resource = require('../EveResource');
import utils = require('../utils')
import Error = require('../Error')
import globals = require('../../globals')
import _ = require('lodash')

class MarketOrders extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch = this.method({
			method: 'GET',
			path: '/char/MarketOrders.xml.aspx',
			cacheDuration: 3600000,
		})
		this.authParamProcessor = utils.keyVCodeProcessor
		this.requestParamProcessor = function(params: globals.Params, deferred: any): globals.Params {
			var results = {};
			if(params && params.characterID && typeof params === 'object') {
				_.assign(results, {characterID: params.characterID});
			}
			if(params && params.orderID && typeof params === 'object') {
				_.assign(results, {orderID: params.orderID});
			}
			return results
		}
	}	
}
export = MarketOrders