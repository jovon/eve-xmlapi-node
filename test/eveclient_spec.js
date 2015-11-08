'use strict';

var testUtils = require('./testUtils'),
    Promise = require('bluebird'),    
    fs = require('fs'),
    http = require('http'),
    expect = require('chai').expect;

describe('EveClient Module', function() {  
  this.timeout(20000);

  describe('ClientUserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var d = Promise.defer();
      var eve = require('../lib/EveClient')({'User-Agent': 'test'});
      eve.getClientUserAgent(function(c) {
        d.resolve(JSON.parse(c));
      });
      return expect(d.promise).to.eventually.have.property('lang', 'node');
    });
  });

  describe('setTimeout', function() {
    var eve = require('../lib/EveClient')();
    it('Should define a default equal to the node default', function() {
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      eve.setTimeout(900);
      expect(eve.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      eve.setTimeout(null);
      expect(eve.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });

  describe('API CallList', function() {
      var callList_xml;
      before(function(done){        
        fs.readFile(__dirname + '/data_examples/APICallList.xml', function (err, xml){
          if(err) console.log("read calllist xml: ", err)
          callList_xml = xml
          done()
        })
      })
            
      it('#fetch returns CallList', function(done) {
          var eve = require('../lib/EveClient')();        
          eve.setCache('file');
          var server = http.createServer()
          eve.setHost('localhost', '1337', 'http')           
          
          server.on('request', function (request, response) {            
            if (request.url === '/Api/CallList.xml.aspx') {
              response.write(callList_xml)                
            }
            response.end()
          })
          
          server.listen(1337)
          
          eve.callList.fetch(function(err, list){
            if(err) console.log("Calllist fetch: ", err) 
            expect(list.eveapi.result[0].rowset[0].row[0].$.groupID).to.equal('1')
            expect(err).to.be.a('null')                     
            server.close(done)
          });
        
      });  
    });
    
    describe('CharacterID', function(){      
      var error122_xml, charID_xml
      before(function(done){
        fs.readFile(__dirname + '/data_examples/Error122.xml', function (err, xml){
            if(err) console.log("Server Error reading Error122.xml: ", err)
            error122_xml = xml
        })
        fs.readFile(__dirname + '/data_examples/CharacterID.xml', function (err, xml){
              if(err) console.log("Server Error reading CharacterID.xml: ", err)
              charID_xml = xml
              done()
        })
      })
      it('#fetch a characterID', function(done){
        var server = http.createServer(), eve = require('../lib/EveClient')();
        server.on('request', function (request, response) {      
            if (request.url != '/eve/CharacterID.xml.aspx?names=CCP%20Garthagk') {
              response.write(error122_xml)
            } else {
              response.write(charID_xml)
            }
            response.end()
        })          
         
        server.listen(1337)
            
        eve.setHost('localhost','1337', 'http')
        eve.characterID.fetch('CCP Garthagk', function(err, charIDs){
          if(err) console.log("charID err fetch: ", err)
          expect(err).to.be.a('null')          
          expect(charIDs.eveapi.result[0].rowset[0].row[0].$.characterID).to.equal('797400947')          
          expect(charIDs.eveapi.result[0].rowset[0].row[0].$.name).to.equal('CCP Garthagk')          
          server.close(done)
        })
      })
      it('#fetch Given an error the callback will receive it', function(done) {
        var server = http.createServer(),
            eve = require('../lib/EveClient')();
            
        eve.setHost('localhost','1337', 'http') 
        server.on('request', function (request, response) {      
          fs.readFile(__dirname + '/data_examples/Error122.xml', function (err, xml){
            if(err) console.log("Server Error reading Error122.xml: ", err)
            fs.readFile(__dirname + '/data_examples/CharacterID.xml', function (err, xml){
              if(err) console.log("Server Error reading CharacterID.xml: ", err)
                                
              if (request.url != '/eve/CharacterID.xml.aspx?names=Edward%20deBristol') {
                response.write(error122_xml)
              } else {
                response.write(charID_xml)
              }
              response.end()
            })
          })
        })
         
        server.listen(1337)        
        
        eve.characterID.fetch({}, function(err, charIDs){          
          expect(err.type).to.equal('EveInvalidRequestError')
          server.close(done)          
        })
                       
      });
            
    })
  });
