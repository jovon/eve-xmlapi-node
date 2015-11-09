var eve = require('./lib/EveClient')()

eve.setCache('file')


eve.serverStatus.fetch(function(err, data) {
	if(err) console.log(err)
	console.log(data)
	return
})


