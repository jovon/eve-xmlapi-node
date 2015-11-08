var eve = require('./lib/EveClient')()

eve.setCache('file')


eve.characterID.fetch('Slithe Plundarr', function(err, data) {
	if(err) console.log('CharacterID: ', err)
	console.log('CharacterID: ',data)
	return
})


