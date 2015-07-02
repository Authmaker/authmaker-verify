var expect = require('chai').expect;
var request = require('supertest');
var autoroute = require('express-autoroute');

var routeFile = rootRequire('./test/fixtures/routes/mongo');

describe("mongo verify functions", function() {

    before(function() {
        //function type
        // routeFile(global.app);

        ////autoroute type
        autoroute(global.app, {
           throwErrors: true,
           routeFile: rootPath('test/fixtures/routes/mongo.js')
        });
    });



    it("should success every time with no verify", function(done) {
        request(global.app)
            .get('/noverify')
            .expect(200, done);
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
