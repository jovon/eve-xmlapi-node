var eve = require('./lib/EveClient')
eve.setUserAgent('Testing EveApi-Node/1.0.0')
eve.setCache('file');
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

var cb = function handler(err, data) {
	if(err) console.log("test err", err)
	if(data) console.log("test data", data)
	return
}
eve.setHost('api.testeveonline.com')

eve.serverStatus.fetch(cb)
// eve.characterID.fetch('Biae', cb)
// eve.characters.fetch(key, cb)

