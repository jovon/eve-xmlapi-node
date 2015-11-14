'use strict';

var testUtils = require('../testUtils'),
    eve = testUtils.getSpyableEveApi(),
    Promise = require('bluebird'),    
    expect = require('chai').expect;

describe('API CallList', function() {
          
      it('#fetch calls callback', function(done) {          
          
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
    });