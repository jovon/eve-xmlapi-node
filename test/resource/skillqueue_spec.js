'use strict';

var testUtils = require('../testUtils'),
    eve = testUtils.getSpyableEveApi(),
    Promise = require('bluebird'),    
    expect = require('chai').expect,
    key = testUtils.getUserEveKey(),
    testKey = testUtils.getUserEveKey();
    
describe('#fetch', function() {          
    it('Sends the correct request with ID param', function(done) {               
        eve.skillQueue.fetch(key)
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