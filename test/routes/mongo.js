var expect = require('chai').expect;
var request = require('supertest');
var autoroute = require('express-autoroute');

var fixture = rootRequire('test/fixtures/users');

describe("mongo verify functions", function() {

    before(function() {
        autoroute(global.app, {
            throwErrors: true,
            routeFile: rootPath('test/fixtures/routes/mongo.js')
        });
    });

    beforeEach(function(){
        return fixture.init();
    });

    afterEach(function(){
        fixture.reset();
    });

    it("should success every time with no verify", function(done) {
        request(global.app)
            .get('/noverify')
            .expect(200, done);
    });

    describe("verify only", function() {
        it("should fail when there is no access token", function(done) {
            request(global.app)
                .get('/verify')
                .expect(401)
                .end(done);
        });
        it("should fail when there is an access token but it doesn't match the database", function(done){
            request(global.app)
                .get('/verify')
                .set('authorization', "Bearer: this_doesnt_really_exist")
                .expect(401)
                .end(done);
        });
        it("should succeed when there is a valid access token", function(done){
            request(global.app)
                .get('/verify')
                .set('authorization', "bearer: valid_access_token_1")
                .expect(200)
                .expect(function(res){
                    expect(res).to.have.property('text', 'Success');
                })
                .end(done);
        });
        it("it should fail if there is a valid, expired access token");
        it("should fail if the endpoint needs a scope permission but the session doesn't have any");
        it("should fail if the endpoint needs a scope permission but the session has the wrong one");
        it("should succeed if the endpoint needs a scope permission and it is on the session");
    });

    describe("rate limited", function() {
        it("should fail if there is no scope and no default");
        it("should succedd if there is a default scope");
        it("should allow 5 requests for a scope that ends with _limit_5_days");
        it("should allow 10 requests for a scope that ends with _limit_5_seconds where there is a 1 second gap after the first 5 requests");
        it("should fail with 6 requests for a scope that ends with _limit_5_days");
        it("should fail with 11 requests for a scope that ends with _limit_5_seconds where there is a 1 second gap after the first 5 requests");
        it("should allow 2 users to send 5 requests each for a scope that ends with _limit_5_days");
    });

    describe("split rate limited", function() {
        it("should allow you to split rate limiting and verification");
    });

    it.skip("should return an array of things", function(done) {
        request(global.app)
            .get('/endpoint')
            .expect(function(res) {
                expect(res.body).to.have.deep.property('things[0]');
                expect(res.body).to.have.deep.property('things.length', 1);
            })
            .end(done);
    });
});
