'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect,
    testKey = testUtils.getUserEveKey();
    
describe('Characters', function() {          
    it('#fetch Sends the correct request with param object', function(done) {        
        var eve = testUtils.getSpyableEveApi();              
        eve.characters.fetch(testKey, function(err, data){
            expect(eve.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/account/Characters.xml.aspx',
                data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode,
                headers: {},
            });
            done()
            eve = null;
        })
    });
    
    it('#fetch returns an Error', function(done){
        var eve = testUtils.getSpyableEveApi();
        eve.setApiKey({}) 
        eve.characters.fetch({}, function(err, charIDs){
          expect(err.type).to.equal('EveInvalidRequestError')
          done()
        }) 
    })
})  