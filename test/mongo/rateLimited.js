var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var Q = require('q');

var expect = chai.expect;
chai.use(chaiAsPromised);

var fixture = rootRequire('test/fixtures/users');
var commonAccessTokenTests = rootRequire('test/helpers/commonAccessTokenTests');
var commonScopeAccessTokenTests = rootRequire('test/helpers/commonScopeAccessTokenTests');

var mongoRateLimited = rootRequire('lib/mongo/rateLimited');

function manyRequests(params, number) {
    var promises = [];

    for(var i = 0; i < number; i++ ){
        promises.push(mongoRateLimited.apply(null, params));
    }

    return Q.all(promises);
}

describe("mongo rateLimited function", function() {

    beforeEach(function() {
        return fixture.init();
    });

    afterEach(function() {
        return fixture.reset();
    });

    commonAccessTokenTests(mongoRateLimited);
    commonScopeAccessTokenTests(mongoRateLimited);

    it("should succeed if there is a default scope", function() {
        return expect(mongoRateLimited("valid_access_token_1","face", "face_limit_10_minutes")).to.be.fulfilled;
    });

    it("should allow 5 requests for a scope that ends with _limit_5_days", function() {
        return expect(manyRequests(['valid_rate_limit_5_days', 'face'], 5)).to.be.fulfilled;
    });

    it("should fail with 6 requests for a scope that ends with _limit_5_days", function(){
        return manyRequests(['valid_rate_limit_5_days', 'face'], 5).then(function(){
            return expect(mongoRateLimited('valid_rate_limit_5_days', 'face')).to.be.rejectedWith('Error: Too Many Requests: Rate limit exceeded for face_limit_5_days');
        });
    });

    it("should allow 10 requests for a scope that ends with _limit_5_seconds where there is a 1 second gap after the first 5 requests",  function(){
        this.timeout(6000);
        return manyRequests(['valid_rate_limit_5_second', 'face'], 5)
            .delay(1000)
            .then(function(){
                return expect(manyRequests(['valid_rate_limit_5_second', 'face'], 5)).to.be.fulfilled;
            });
    });
    it("should fail with 11 requests for a scope that ends with _limit_5_seconds where there is a 1 second gap after the first 5 requests",  function(){
        return manyRequests(['valid_rate_limit_5_second', 'face'], 5)
            .delay(1000)
            .then(function(){
                return manyRequests(['valid_rate_limit_5_second', 'face'], 5);
            })
            .then(function(){
                return expect(manyRequests(['valid_rate_limit_5_second', 'face'], 5)).to.be.rejectedWith('Error: Too Many Requests: Rate limit exceeded for face_limit_5_seconds');
            });
    });

    it("should allow 2 users to send 5 requests each for a scope that ends with _limit_5_days", function(){
        return manyRequests(['valid_rate_limit_5_days', 'face'], 5)
            .then(function(){
                return expect(manyRequests(['valid_rate_limit_5_days_user2', 'face'], 5)).to.be.fulfilled;
            });
    });

    it("should fail when 1 user makes 6 requests for a scope that ends with _limit_5_seconds where the last one has a different access_token", function(){
        return manyRequests(['valid_rate_limit_5_days_user3_access_token1', 'face'], 5)
            .then(function(){
                return expect(mongoRateLimited('valid_rate_limit_5_days_user3_access_token2', 'face')).to.be.rejectedWith('Error: Too Many Requests: Rate limit exceeded for face_limit_5_seconds');
            });
    });
});
