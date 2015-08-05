var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

var expect = chai.expect;
chai.use(chaiAsPromised);

var fixture = rootRequire('test/fixtures/users');
var commonAccessTokenTests = rootRequire('test/helpers/commonAccessTokenTests');
var commonScopeAccessTokenTests = rootRequire('test/helpers/commonScopeAccessTokenTests');

var mongoVerify = rootRequire('lib/mongo/verify');

describe("mongo verify function", function() {

    beforeEach(function() {
        return fixture.init();
    });

    afterEach(function() {
        fixture.reset();
    });

    commonAccessTokenTests(mongoVerify);
    commonScopeAccessTokenTests(mongoVerify);

    it("should succeed when there is a valid access token", function() {
        return expect(mongoVerify('valid_access_token_1')).to.be.fulfilled;
    });

    it("should succeed if the endpoint needs a scope permission and it is on the session", function() {
        return expect(mongoVerify('valid_face_permission', 'face_permissions')).to.be.fulfilled;
    });
});
