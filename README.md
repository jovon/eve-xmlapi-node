# Eve-XMLAPI-TS

	A Node.js package for fetching data from Eve Online's XML API.

##	Installing

	npm install eve-xmlapi
	
##	Usage

	var Eve = require('eve-xmlapi')
	var eve = new Eve()
	
	// Set your own User-Agent
	eve.setUserAgent('eve-xmlapi-node/0.0.1 (git://github.com/jovon/eve-xmlapi-node.git)')
	
	eve.setHost('api.testeveonline.com')// Default: 'api.eveonline.com'
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
	eve.setCache('file', {path: '/tmp', prefix: ''}) 
	//These 'path' and 'prefix' settings are default options and unnecessary.
	
		OR		
	eve.setCache('redis', {port: 6379, host: '127.0.0.1'})  
	//These 'port' and 'host' settings are default options and unnecessary
	
	
	// If you don't like the format of the return JSON...	
	//  Change all JSON responses
	eve.transformAllResponses = function(resp){
		var results = {}
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

	// Important to note if you've used 'setApiKey', putting the keyID 
	// and vCode into the parameters will override it.
	eve.accountStatus.fetch({keyID: '123', vCode: '12345'}, callback)
	eve.apiKeyInfo.fetch({keyID: '123', vCode: '12345'}, callback)
	eve.blueprints.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.calendarEventAttendees.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)		
	eve.callList.fetch({keyID: '123', vCode: '12345'}, callback)
	eve.characterAffiliation.fetch({ids: ['123', '321']}, callback)
	eve.characterInfo.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.characterName.fetch({ids: ['123', '321']}, callback)
	eve.characterID.fetch({names: ['CCP FoxFour', 'CCP Tellus']}, callback)	
	eve.characters.fetch({keyID: '123', vCode: '12345'}, callback)	
	eve.characterSheet.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)	
	eve.chatChannels.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)
	eve.contactList.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)
	eve.contactNotifications.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)
	eve.contractBids.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.contractItems.fetch({keyID: '1234', vCode: '12345', characterID: '123', 
		contractID: '123'}, callback)
	eve.contracts.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback) //contractID is optional	
	eve.facWarStats.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.mailingLists.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.mailMessages.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)		
	eve.marketOrders.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback) // characterID and orderID optional
	eve.skillQueue.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)
	eve.upcomingCalendarEvents.fetch({keyID: '1234', vCode: '12345',
		characterID: '123'}, callback)	
	
	// char resources with matching corp resources that start with char
	eve.charAccountBalance.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, 
		callback)
	eve.charAssetList.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)
	eve.charBookmarks.fetch({keyID: '1234', vCode: '12345', characterID: '123'}, 
		callback)		
	eve.charWalletJournal.fetch({keyID: '1234', vCode: '12345',
		characterID: '123'}, 
		callback)// accountKey, fromID and rowCount are optional		
	eve.charWalletTransactions.fetch({keyID: '1234', vCode: '12345',
		characterID: '123'},
		callback)// accountKey, fromID and rowCount are optional
	
	// corp resources
	eve.corpAccountBalance.fetch({keyID: '1234', vCode: '12345', 
		characterID: '123'}, callback)
	eve.corpBookmarks.fetch({keyID: '1234', vCode: '12345', characterID: '123'},
		callback)
	eve.corpWalletJournal.fetch({keyID: '1234', vCode: '12345',
		characterID: '123', accountKey: '1002'},
		callback)// fromID and rowCount are optional
	eve.corpWalletTransactions.fetch({keyID: '1234', vCode: '12345',
		characterID: '123', accountKey:'1001'},
		callback)// fromID and rowCount are optional
	
	eve.allianceList.fetch(callback)
	eve.conquerableStationList.fetch(callback)
	eve.errorList.fetch(callback)
	eve.refTypes.fetch(callback)
	eve.typeName.fetch(callback)
	eve.facWarSystems.fetch(callback)
	eve.jumps.fetch(callback)
	eve.kills.fetch(callback)
	eve.sovereignty.fetch(callback)
	eve.serverStatus.fetch(callback)

##	Development

	git clone https://github.com/jovon/eve-xmlapi-ts.git
	
	cd eve-xmlapi-ts
	
	npm install
	
	tsd install
	
	Eve-xmlapi-node is written with Typescript 1.7.3.
