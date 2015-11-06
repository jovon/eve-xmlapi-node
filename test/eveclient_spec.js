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

  describe('Callback support', function() {      
      it('Will call a callback if successful', function(done) {
        var eve = require('../lib/EveClient')();
        var server = http.createServer()
        eve.setHost('localhost', '1337', 'http')
        
        fs.readFile(__dirname + '/data_examples/APICallList.xml', function (err, xml){
          if(err) defer.reject(err)   
          
          server.on('request', function (request, response) {
            if(err) console.log(err)      
            if (request.url === '/Api/CallList.xml.aspx') {
              response.write(xml)                
            }
            response.end()            
          })
          
          server.listen(1337)
          
          eve.callList.fetch(function(err, list){ 
            expect(list.eveapi.result[0].rowset[0].row[0].$.groupID).to.equal('1')
            expect(err).to.not.exist
            expect(list).to.be.a('object')            
            server.close(done)
          });
        })       
      });
      

      it('Given an error the callback will receive it', function(done) {
        var server = http.createServer(),
            eve = require('../lib/EveClient')();
            
        eve.setHost('localhost','1338', 'http') 
        server.on('request', function (request, response) {      
          fs.readFile(__dirname + '/data_examples/Error122.xml', function (err, error_xml){
            if(err) console.log(err)
            fs.readFile(__dirname + '/data_examples/CharacterID.xml', function (err, xml){
              if(err) console.log(err)      
              if (request.url != '/eve/CharacterID.xml.aspx?names=Edward%20deBristol') {
                response.write(error_xml)
              } else {
                response.write(xml)
              }
              response.end()
            })
          })
        })
                      
        
        server.listen(1338)        
        
        eve.characterID.fetch({}, function(err, charIDs){
          expect(err).to.exist
          expect(err.type).to.equal('InvalidRequestError')          
          server.close(done)
        })  
               
      });     
    });
    
  });
