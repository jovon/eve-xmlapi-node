var FileCache = require('./lib/cache/file'),
	cache = new FileCache(),
	fs = require('fs')
	

cache.write('herp1234', 'derp', 60, function(err, file){
	var exsts = false
	if(err) {
		console.log(err); 
		return
	} else {		
		(function loop() {
			if(!exsts) {
				fs.exists(file, function(exists){
					exsts = exists
					if(exists) {
						cache.read('herp1234', function(err, data){			
							console.log('READ completed:', data)							
						})
					} else {
						loop()
					}										
				})
			}
					
		}());
		
	}
})


