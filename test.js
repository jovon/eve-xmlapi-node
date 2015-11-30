var eve = require('./lib/EveClient')
eve.setUserAgent('Testing EveApi-Node/0.0.1')
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

var handler = function handler(data) {
	if(data) console.log("test data", data)	
}
eve.setHost('api.testeveonline.com')

// eve.serverStatus.fetchP().then(function(data){
// 	console.log(data)
// })
// eve.characterID.fetch('Biae', cb)
eve.characters.fetchP(key)
				.then(handler)
				.catch(function(e){
					console.log("error: ", e)
				})

