var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

var expect = chai.expect;
chai.use(chaiAsPromised);

function commonAccessTokenTests(fn){
    it("should fail when there is no access token", function() {
        return expect(fn()).to.be.rejectedWith('Error: Not Authorized: session not found with that access token');
    });

    it("should fail when there is an access token but it doesn't match the database", function() {
        return expect(fn('this_doesnt_really_exist')).to.be.rejectedWith('Error: Not Authorized: session not found with that access token');
    });

    it("it should fail if there is a valid, expired access token", function() {
        return expect(fn('expired_access_token')).to.be.rejectedWith('Not Authorized: session has expired');
    });
}

module.exports = commonAccessTokenTests;
