'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect,
    testParams = testUtils.getParams();

describe('Skill Queue', function () {
    describe('#fetch', function () {
        it('Sends the correct request with param object', function (done) {
            var eve = testUtils.getSpyableEveApi()
            eve.skillQueue.fetch(testParams, function (err, queue) {
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/char/SkillQueue.xml.aspx',
                    data: "keyID=" + testParams.keyID + "&vCode=" + testParams.vCode + "&characterID=" + testParams.characterID,
                    headers: {},
                });
                done()
            })
        });

        it('returns an Error', function (done) {
            var eve = testUtils.getSpyableEveApi()
            eve.setApiKey({ 'keyID': '', 'vCode': '' })
            eve.skillQueue.fetch({}, function (err, queue) {
                expect(err.type).to.equal('EveInvalidRequestError')
                done()
            })
        })
    })
    describe('#fetchP', function () {        
        it('Sends the correct request with param object', function () {
            var eve = testUtils.getSpyableEveApi()
            eve.skillQueue.fetchP(testParams).then(function (data) {
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/char/SkillQueue.xml.aspx',
                    data: "keyID=" + testParams.keyID + "&vCode=" + testParams.vCode + "&characterID=" + testParams.characterID,
                    headers: {},
                })
            }).catch(function (err) {
                expect(err).to.be.undefined
            })            
        });

        it('returns an Error', function () {
            var eve = testUtils.getSpyableEveApi()
            eve.setApiKey({ 'keyID': '', 'vCode': '' })
            eve.skillQueue.fetchP({}).then(function (data) {
                expect(data).to.be.undefined
            }).catch(function (err) {
                expect(err.type).to.equal('EveInvalidRequestError')
            })                        
        })
    })
})  