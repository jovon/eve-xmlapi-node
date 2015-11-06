var eve = require('./lib/eveclient')('', 'latest')

eve.callList.fetch(function(err, data){
	console.log(data)	
})