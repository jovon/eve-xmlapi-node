'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect,
    testKey = testUtils.getUserEveKey();

describe('Characters', function () {
    describe('#fetch', function () {
        it('Sends the correct request with param object', function (done) {
            var eve = testUtils.getSpyableEveApi();
            eve.characters.fetch(testKey, function (err, data) {
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/account/Characters.xml.aspx',
                    data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode,
                    headers: {},
                });
                done()                
            })
        });

        it('returns an Error', function (done) {
            var eve = testUtils.getSpyableEveApi();
            eve.characters.fetch({}, function (err, charIDs) {
                expect(err.type).to.eql('EveInvalidRequestError')
                done()
            })
        })
    })
    describe('#fetchP', function () {
        it('Sends the correct request with param object', function () {
            var eve = testUtils.getSpyableEveApi()
            var e;
            eve.characters.fetchP(testKey).then(function (queue) {
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/account/Characters.xml.aspx',
                    data: "keyID=" + testKey.keyID + "&vCode=" + testKey.vCode,
                    headers: {},
                })
            }).catch(function (err) {
                e = err
            })
            expect(e).to.be.undefined
        });

        it('returns an Error', function () {
            var eve = testUtils.getSpyableEveApi()
            var c;
            eve.setApiKey({ 'keyID': '', 'vCode': '' })
            eve.characters.fetchP({}).then(function (chars) {
                c = chars
            }).catch(function (err) {
                expect(err.type).to.eql('EveInvalidRequestError')
            })
            expect(c).to.be.undefined
        })
    })
})  