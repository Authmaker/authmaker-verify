var moment = require('moment');

var db = require('./db');
var models = require('./db/models');

var mongoVerify = require('./lib/mongo/verify');
var checkAccessToken = require('./lib/common/checkAccessToken');

var _ = require('lodash');
var moment = require('moment');

global.rootRequire = function(fileName) {
    return require(__dirname + '/' + fileName);
};

module.exports = {
    mongoRateLimited: function(access_token, tag, defaultScope) {
        if(!tag) {
            throw new Error("Incorrect parameter: Missing tag in arguments passed");
        }

        return checkAccessToken(access_token)
        .then(function(session){
            var scope = _.find(session.scopes, function(scope) {
                if(scope === tag) {
                    throw new Error("Incorrect parameter: Only tag name required to be passed from " + scope);
                }
                return scope.startsWith(tag);
            });

            if(!scope && defaultScope){
                scope = defaultScope;
            }

            if (!scope) {
                throw new Error("Not Authorized: No Scope associated with " + tag);
            }

            var scopeParts = scope.split('_');

            if(scopeParts.length !== 4) {
                throw new Error("Malformed Scope: " + scope + " is not a rate limited scope. e.g. tagname_limit_10_day");
            }

            var limit = scopeParts[2].trim();
            var period = scopeParts[3].trim();

            return models.auditTrail.find({
                tag: tag,
                date: {
                    $gte: moment().subtract(1, period)
                }
            }).count().exec().then(function(count) {
                if (count >= limit) {
                    throw new Error("Too Many Requests: Rate limit exceeded for " + scope);
                }

                return models.auditTrail.create({
                    access_token: access_token,
                    tag: tag,
                    userId: session.userId,
                    date: new Date()
                }).then(function() {
                    return session;
                });
            });
        });
    },
    mongo: mongoVerify,
    connectMongo: function(nconf) {
        //initialise the db
        db(nconf);
    },

    rateLimited: function(){
        //TODO split this out into a non mongo file when we have one
    }
};

if(process.env.NODE_ENV === "test"){
    module.exports.models = models;
    module.exports.mongoose = require('mongoose');
}
