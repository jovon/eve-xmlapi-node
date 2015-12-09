'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect;

describe('API CallList', function() {	
	describe('#fetch', function(){
		it('calls a callback', function(done) {
			var eve = testUtils.getSpyableEveApi()        
			eve.callList.fetch(function(err, list){
				if(err) console.log("Calllist fetch: ", err) 
				expect(err).to.be.a('null')
				expect(eve.LAST_REQUEST).to.deep.equal({
					method: 'GET',
					url: '/Api/CallList.xml.aspx',
					data: '',
					headers: {},
				});                     
				done()
			});
		});
		it('calls a promise', function() {
			var eve = testUtils.getSpyableEveApi()
			eve.callList.fetchP().then(function(list){
				
			}).catch(function(err){
				if(err) console.log("Calllist fetch: ", err) 
				expect(err).to.be.a('null')				
			})
			expect(eve.LAST_REQUEST).to.deep.equal({
					method: 'GET',
					url: '/Api/CallList.xml.aspx',
					data: '',
					headers: {},
			});
		}) 
	}); 
});