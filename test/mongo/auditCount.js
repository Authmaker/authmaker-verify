var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var Q = require('q');
var moment = require('moment');

var expect = chai.expect;
chai.use(chaiAsPromised);

var fixture = rootRequire('test/fixtures/users');

var mongoRateLimited = rootRequire('lib/mongo/rateLimited');
var mongoAuditCount = rootRequire('lib/mongo/auditCount');
var commonAccessTokenTests = rootRequire('test/helpers/commonAccessTokenTests');

function manyRequests(params, number) {
    var promises = [];

    for(var i = 0; i < number; i++ ){
        promises.push(mongoRateLimited.apply(null, params));
    }

    return Q.all(promises);
}

describe("mongo auditCount function", function() {

    beforeEach(function() {
        return fixture.init();
    });

    afterEach(function() {
        fixture.reset();
    });

    commonAccessTokenTests(mongoAuditCount);

    //all following tests assume a valid access_token
    it("should return 0 with no requests", function(){
        return expect(mongoAuditCount('valid_rate_limit_5_second', 'face')).to.eventually.become(0);
    });

    it("should return 1 with one request", function(){
        return mongoRateLimited("valid_rate_limit_5_second", "face").then(function(){
            return expect(mongoAuditCount('valid_rate_limit_5_second', 'face')).to.eventually.become(1);
        });
    });

    it("should return 100 with 100 requests", function(){
        return manyRequests(['valid_rate_limit_5_second', 'face'], 100).then(function(){
            return expect(mongoAuditCount('valid_rate_limit_5_second', 'face')).to.eventually.become(100);
        });
    });

    it("should return 10 with 2 sets of 5 requests with 1 second between them", function(){
        return manyRequests(['valid_rate_limit_5_second', 'face'], 5)
            .delay(1000)
            .then(function(){
                return manyRequests(['valid_rate_limit_5_second', 'face'], 5);
            })
            .then(function(){
                return expect(mongoAuditCount('valid_rate_limit_5_second', 'face')).to.eventually.become(10);
            });
    });

    it("should return 0 when called with since parameter: 1 second ago after 5 requests and a 1.1 second pause", function(){
        return manyRequests(['valid_rate_limit_5_second', 'face'], 5)
            .delay(1100)
            .then(function(){
                return expect(mongoAuditCount('valid_rate_limit_5_second', 'face', moment().subtract(1, 'seconds'))).to.eventually.become(0);
            });
    });

    it("should return 5 when called with since parameter: 1 second ago after 5 requests, 1.1 second pause, 5 requests", function(){
        return manyRequests(['valid_rate_limit_5_second', 'face'], 5)
            .delay(1100)
            .then(function(){
                return manyRequests(['valid_rate_limit_5_second', 'face'], 5);
            })
            .then(function(){
                return expect(mongoAuditCount('valid_rate_limit_5_second', 'face', moment().subtract(1, 'seconds'))).to.eventually.become(5);
            });
    });

    it("should return 2 after 2 requests are made with different access tokens", function(){
        return mongoRateLimited('valid_rate_limit_5_days_user3_access_token1', 'face')
            .then(function(){
                return mongoRateLimited('valid_rate_limit_5_days_user3_access_token2', 'face');
            })
            .then(function(){
                return expect(mongoAuditCount('valid_rate_limit_5_days_user3_access_token1', 'face', moment().subtract(1, 'seconds'))).to.eventually.become(2);
            });
    });

    // it("should fail when 1 user makes 6 requests for a scope that ends with _limit_5_seconds where the last one has a different access_token", function(){
    //     return manyRequests(['valid_rate_limit_5_days_user3_access_token1', 'face'], 5)
    //         .then(function(){
    //             return expect(mongoRateLimited('valid_rate_limit_5_days_user3_access_token2', 'face')).to.be.rejectedWith('Error: Too Many Requests: Rate limit exceeded for face_limit_5_seconds');
    //         });
    // });
});
