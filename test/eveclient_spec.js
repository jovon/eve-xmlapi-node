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
      var eve = require('../lib/EveClient')();
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
        var defer = Promise.defer();
        var eve = require('../lib/EveClient')();
        var server = http.createServer()
        eve.setHost('localhost', '1337', 'http')
        
        fs.readFile(__dirname + '/data_examples/APICallList.xml', function (err, xml){
          if(err) defer.reject(err)   
          
          server.on('request', function (request, response) {
                       
            if (request.url === '/Api/CallList.xml.aspx') {
              response.write(xml)
              response.end()              
            }
            
          })
          
          server.listen(1337)
          
          eve.callList.fetch(function(err, queue){ 
              console.log("in fetch")                     
              if(!err){
                defer.resolve('Called!');
              } else {
                defer.reject('ErrorWasPassed')
              }
              server.close()
          });
          done()          
        })

        return expect(defer.promise).to.eventually.equal('Called!');
      });
      

      it('Given an error the callback will receive it', function(done) {
        var defer = Promise.defer();
        var server = http.createServer()
        var eve = require('../lib/EveClient')();
        eve.setHost('localhost','1338', 'http')
        
        fs.readFile('./data_examples/Error122.xml', function (err, xml){          
          server.on('request', function (request, response) {            
            if (request.url === '/eve/CharacterID.xml.aspx') {
              response.write(xml)
              response.end()
            }
          })
        })
        
        server.listen(1338)
        
        eve.characterID.fetch({}, function(err, charIDs){
          console.log(err, charIDs)      
          if(err) {            
            defer.resolve('ErrorWasPassed')
          } else {
            var charID = charIDs.eveapi.result[0].rowset[0].row[0].$.characterID                        
            defer.reject('Called!', charID)
          }
          server.close()         
        })
        done()
        return expect(defer.promise).to.eventually.become('ErrorWasPassed')
      });     
    });
    
  });
