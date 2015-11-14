'use strict';

var testUtils = require('../testUtils'),
    Promise = require('bluebird'),    
    eve = testUtils.getSpyableEveApi(),
    expect = require('chai').expect;


describe('CharacterID', function(){      
      var name = 'CCP Garthagk'
      var testName = 'CCP%20Garthagk'
      
      it('#fetch a characterID', function(done){
        
        eve.characterID.fetch({names: [name]}, function(err, charIDs){
          if(err) console.log("charID err fetch: ", err)
          expect(err).to.be.a('null')
          expect(eve.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/eve/CharacterID.xml.aspx?names='+testName,
                data: '',
                headers: {},
            });          
          })
        eve.characterID.fetch({names: name}, function(err, charIDs){
          if(err) console.log("charID err fetch: ", err)
          expect(err).to.be.a('null')          
          expect(eve.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/eve/CharacterID.xml.aspx?names='+testName,
                data: '',
                headers: {},
            });
        })
        eve.characterID.fetch(name, function(err, charIDs){
          if(err) console.log("charID err fetch: ", err)
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
      it('#fetch Given an error the callback will receive it', function(done) {
               
        eve.characterID.fetch({}, function(err, charIDs){          
          expect(err.type).to.equal('EveInvalidRequestError')
          done()        
        })                       
      });            
    })