'use strict';

var testUtils = require('../testUtils'),
    eve = testUtils.getSpyableEveApi(),
    expect = require('chai').expect,
    testKey = testUtils.getUserEveKey();
    
describe('Characters', function() {          
    it('#fetch Sends the correct request with param object', function(done) {               
        eve.characters.fetch(testKey)
        expect(eve.LAST_REQUEST).to.deep.equal({
            method: 'GET',
            url: '/account/Characters.xml.aspx',
            data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode,
            headers: {},
        });
        done() 
    });
    
    it('#fetch returns an Error', function(done){
        eve.setApiKey({})        
        eve.characters.fetch({}, function(err, charIDs){          
          expect(err.type).to.equal('EveInvalidRequestError')
          done()
        }) 
    })
})  