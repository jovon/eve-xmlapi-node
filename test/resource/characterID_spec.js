'use strict';

var testUtils = require('../testUtils'),
    eve = testUtils.getSpyableEveApi(),
    expect = require('chai').expect;


describe('CharacterID', function(){      
    var name = 'CCP Garthagk'
    var testName = 'CCP%20Garthagk'
    
    describe('#fetch', function(){
        it('returns a characterID with an array in an object argument', function(done){        
            eve.characterID.fetch({names: [name]}, function(err, charIDs){
                expect(err).to.be.a('null')
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/eve/CharacterID.xml.aspx?names='+testName,
                    data: '',
                    headers: {},
                });
                done()          
            })
        })
        it('returns a characterID with an object argument', function(done){
            eve.characterID.fetch({names: name}, function(err, charIDs){
                expect(err).to.be.a('null')          
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/eve/CharacterID.xml.aspx?names='+testName,
                    data: '',
                    headers: {},
                });
                done()
            })
        })
        it('returns a characterID with a string argument', function(done){
            eve.characterID.fetch(name, function(err, charIDs){
                expect(err).to.be.a('null')
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/eve/CharacterID.xml.aspx?names='+testName,
                    data: '',
                    headers: {},
                });
                done()
            })
        })
        it('Given an error the callback will receive it', function(done) {               
            eve.characterID.fetch({}, function(err, charIDs){      
                expect(err.type).to.equal('EveInvalidRequestError')
                done()
            })                       
        });
    })            
})