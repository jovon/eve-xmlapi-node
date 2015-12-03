'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect;


describe('Alliance List', function(){      
    describe('#fetch', function(){
        it('returns the Alliance List', function(done){
            var eve = testUtils.getSpyableEveApi()            
            eve.allianceList.fetch({version: 2}, function(err, allList){
                if(err) console.error(err)
				expect(err).to.be.a('null')
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/eve/AllianceList.xml.aspx?version=2',
                    data: '',
                    headers: {},
                });
                done()          
            })
        })
	})
})