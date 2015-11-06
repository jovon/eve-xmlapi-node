var eve = require('./lib/EveClient')()

eve.serverStatus.fetch(function(err, data){
	console.log(data)	
})
