'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect,
    testKey = testUtils.getParams();
    
describe('Skill Queue', function() {          
    it('#fetch Sends the correct request with param object', function(done) {
        var eve = testUtils.getSpyableEveApi()
        eve.skillQueue.fetch(testKey, function(err, queue){
            expect(eve.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/char/SkillQueue.xml.aspx',
                data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode + "&characterID="+testKey.characterID,
                headers: {},
            });
            done()
        })        
    });
    
    it('#fetch returns an Error', function(done){
        var eve = testUtils.getSpyableEveApi()
        eve.skillQueue.fetch({}, function(err, queue){
          expect(err.type).to.equal('EveInvalidRequestError')
          done()
        }) 
    })
})  