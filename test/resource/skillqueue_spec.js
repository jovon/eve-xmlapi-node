'use strict';

var testUtils = require('../testUtils'),
    eve = testUtils.getSpyableEveApi(),
    expect = require('chai').expect,
    testKey = testUtils.getParams();
    
describe('Skill Queue', function() {          
    it('#fetch Sends the correct request with param object', function(done) {               
        eve.skillQueue.fetch(testKey)
        expect(eve.LAST_REQUEST).to.deep.equal({
            method: 'GET',
            url: '/char/SkillQueue.xml.aspx',
            data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode + "&characterID="+testKey.characterID,
            headers: {},
        });
        done() 
    });
    
    it('#fetch returns an Error', function(done){
        eve.skillQueue.fetch({}, function(err, charIDs){          
          expect(err.type).to.equal('EveInvalidRequestError')
          done()
        }) 
    })
})  