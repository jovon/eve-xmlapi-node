var EveClient = require('./lib/EveClient')
var eve = new EveClient()
eve.setUserAgent('Testing EveApi-Node/0.0.1')
// eve.setCache('file');
var key = require('./test/testUtils').getUserEveKey()
var config = require('./test/config')


eve.transformAllResponses = function(resp){
	var results = {};
	results.eveapi = resp.eveapi.$
	results.cachedUntil = resp.eveapi.cachedUntil[0]
	results.currentTime = resp.eveapi.currentTime[0]
	if(resp.eveapi.result) results.result = resp.eveapi.result[0]
	return results
}
eve.accountStatus.transformResponseData = function(resp){
	resp.result.paidUntil = resp.result.paidUntil[0]
	resp.result.createDate = resp.result.createDate[0]
	resp.result.logonCount = resp.result.logonCount[0]
	resp.result.logonMinutes = resp.result.logonMinutes[0]	
	return resp
}

var dataHandler = function dataHandler(data) {
	console.log("test data: ", data.result.rowset[0].row)	
}
var errorHandler = function(e){
					console.log("error: ", e)
				}
var callback = function cb(err, data) {
	if(err) console.log("test err: ", err)
	if(data) console.log("test data: ", data.result.rowset[0].row)
	return
}
eve.setHost('api.testeveonline.com')
eve.setApiKey(key)
// eve.serverStatus.fetch(callback)
// eve.characterID.fetch('Edward deBristol', callback)
// eve.characters.fetchP()
// 				.then(dataHandler)
// 				.catch(errorHandler)

eve.skillQueue.fetchP({characterID: config.TEST_CHARID})
				.then(dataHandler)
				.catch(errorHandler)

// eve.charAccountBalance.fetchP({characterID: config.TEST_CHARID})
// 				.then(dataHandler)
// 				.catch(errorHandler)

// eve.allianceList.fetchP({version: 1})//{characterID: config.TEST_CHARID})
// 				.then(dataHandler)
// 				.catch(errorHandler)

// eve.sovereignty.fetch(callback)