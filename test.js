var eve = require('./lib/EveClient')()

var key = require('./test/testUtils').getUserEveKey()

eve.transformAllResponses = function(resp){
	var results = {};
	results.eveapi = resp.eveapi.$
	results.cachedUntil = resp.eveapi.cachedUntil[0]
	results.currentTime = resp.eveapi.currentTime[0]
	if(resp.eveapi.result) results.result = resp.eveapi.result[0]
	return results
}
eve.serverStatus.transformResponseData = function(resp){
	resp.result.serverOpen = resp.result.serverOpen[0]
	resp.result.onlinePlayers = resp.result.onlinePlayers[0]	
	return resp
}

// eve.characters.fetch(key, function(err, data) {
// 	if(err) console.log("test err", err)
// 	if(data) console.log("test data", data.result.rowset[0].row)
// 	return data	
// })

var handler = function handler(err, data) {
	if(err) console.log("test err", err)
	if(data) console.log("test data", data)
	return data	
}
eve.setHost('api.testeveonline.com')

eve.serverStatus.fetch(handler)
// eve.characterID.fetch('Biae', handler)

