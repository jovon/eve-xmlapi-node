'use strict';

var testUtils = require('../testUtils'),
    expect = require('chai').expect,
    testParams = testUtils.getParams();

describe('ApiKeyInfo', function () {
    describe('#fetch', function () {
        it('Sends the correct request with param object', function (done) {
            var eve = testUtils.getSpyableEveApi()
            eve.apiKeyInfo.fetch(testParams, function (err, data) {
                expect(eve.LAST_REQUEST).to.deep.equal({
                    method: 'GET',
                    url: '/account/APIKeyInfo.xml.aspx',
                    data: "keyID=" + testParams.keyID + "&vCode=" + testParams.vCode,
                    headers: {},
                });
                done()
            })
        });

        it('returns an Error', function (done) {
            var eve = testUtils.getSpyableEveApi()
            eve.setApiKey({ 'keyID': '', 'vCode': '' })
            eve.accountStatus.fetch({}, function (err, data) {
                expect(err.type).to.equal('EveInvalidRequestError')
                done()
            })
        })
    })
})