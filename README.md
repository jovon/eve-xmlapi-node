# Eve-XMLAPI-Node

##	Installing
	npm install eve-xmlapi
	
##	Usage
	var Eve = require('eve-xmlapi');
	var eve = Eve()
	
	// Set your own User-Agent
	eve.setUserAgent('eve-xmlapi-node/0.0.1 (git://github.com/jovon/eve-xmlapi-node.git)')
	
	eve.setHost('api.testeveonline.com')
	eve.setApiKey({keyID: '', vCode: ''})
	
	// With a callback
	eve.serverStatus.fetch(function(err, data) {
		console.log(data)
	})
	
	// With a promise, add 'P' to the end of fetch.
	eve.serverStatus.fetchP().then(function(data) {
		console.log(data)
	}).catch(function(e){
		console.log(e)
	})
	
	// Set a cache: file, redis, or memory by default.
	
	// 'prefix' will be added to the beginning of each file.
	eve.setCache('file', {path: '/temp', prefix: ''}) 
		OR		
	eve.setCache('redis', {port: 6379, host: '127.0.0.1'})
	
	
	// If you don't like the format of the return JSON	
	//  Change all JSON responses
	eve.transformAllResponses = function(resp){
		var results = {};
		results.eveapi = resp.eveapi.$
		results.cachedUntil = resp.eveapi.cachedUntil[0]
		results.currentTime = resp.eveapi.currentTime[0]
		if(resp.eveapi.result) results.result = resp.eveapi.result[0]
		return results
	}
	
	// Change a single resource's response
	eve.serverStatus.transformResponseData = function(resp){
		resp.result.serverOpen = resp.result.serverOpen[0]
		resp.result.onlinePlayers = resp.result.onlinePlayers[0]
		return resp
	}
	
	More to come...

##	Development
	git clone https://github.com/jovon/eve-xmlapi-node.git
	
	cd eve-xmlapi-node
	
	npm install
	
	tsd install
	
	Eve-xmlapi-node is written with Typescript 1.7.3.