var eve = require('./lib/EveClient')()

eve.setCache('file')
eve.transformAllResponses = function(resp){
	var results = {};
	results.eveapi = resp.eveapi.$
	results.cachedUntil = resp.eveapi.cachedUntil[0]
	results.currentTime = resp.eveapi.currentTime[0]
	results.result = resp.eveapi.result[0]
	return results
}
eve.serverStatus.transformResponseData = function(resp){
	resp.result.serverOpen = resp.result.serverOpen[0]
	resp.result.onlinePlayers = resp.result.onlinePlayers[0]	
	return resp
}

eve.serverStatus.fetch(function(err, data) {
	if(err) console.log("test err", err)
	if(data) console.log("test data", data)
	
})
