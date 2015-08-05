var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

var expect = chai.expect;
chai.use(chaiAsPromised);

var fixture = rootRequire('test/fixtures/users');

var mongoVerify = rootRequire('lib/mongo/verify');

describe("mongo verify function", function() {

    beforeEach(function() {
        return fixture.init();
    });

    afterEach(function() {
        fixture.reset();
    });


    it("should fail when there is no access token", function() {
        return expect(mongoVerify()).to.be.rejectedWith('Error: Not Authorized: session not found with that access token');
    });

    it("should fail when there is an access token but it doesn't match the database", function() {
        return expect(mongoVerify('this_doesnt_really_exist')).to.be.rejectedWith('Error: Not Authorized: session not found with that access token');
    });

    it("should succeed when there is a valid access token", function() {
        return expect(mongoVerify('valid_access_token_1')).to.be.fulfilled;
    });

    it("it should fail if there is a valid, expired access token", function() {
        return expect(mongoVerify('expired_access_token')).to.be.rejectedWith('Not Authorized: session has expired');
    });

    it("should fail if the endpoint needs a scope permission but the session doesn't have any", function() {
        return expect(mongoVerify('valid_access_token_1', 'face_permissions')).to.be.rejectedWith('Not Authorized: No scope associated with face_permissions');
    });

    it("should fail if the endpoint needs a scope permission but the session has the wrong one", function() {
        return expect(mongoVerify('valid_rate_limit_5_days', 'face_permissions')).to.be.rejectedWith('Not Authorized: No scope associated with face_permissions');
    });

    it("should succeed if the endpoint needs a scope permission and it is on the session", function() {
        return expect(mongoVerify('valid_face_permission', 'face_permissions')).to.be.fulfilled;
    });
});
