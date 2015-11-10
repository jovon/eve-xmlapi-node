var eve = require('./lib/EveClient')()

eve.setCache('file')

eve.serverStatus.fetch(function(err, data) {
	if(err) console.log("test err", err)
	if(data) console.log("test data", data.eveapi)
	
})
