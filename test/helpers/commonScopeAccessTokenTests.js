var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

var expect = chai.expect;
chai.use(chaiAsPromised);

function commonAccessTokenTests(fn){
    it("should fail if the endpoint needs a scope permission but the session doesn't have any", function() {
        return expect(fn('valid_access_token_1', 'face_permissions')).to.be.rejectedWith('Not Authorized: No scope associated with face_permissions');
    });

    it("should fail if the endpoint needs a scope permission but the session has the wrong one", function() {
        return expect(fn('valid_rate_limit_5_days', 'face_permissions')).to.be.rejectedWith('Not Authorized: No scope associated with face_permissions');
    });
}

module.exports = commonAccessTokenTests;
