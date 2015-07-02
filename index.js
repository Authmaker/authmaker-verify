var _ = require('lodash');
var authmakerCommon = require('authmaker-common');
var moment = require('moment');

var models = authmakerCommon.models;

var mongoVerify = require('./lib/mongo/verify');
var checkAccessToken = require('./lib/common/checkAccessToken');


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
                return scope.indexOf(tag) === 0;
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
                userId: session.userId,
                date: {
                    $gt: moment().subtract(1, period).toDate()
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
        authmakerCommon.init(nconf);
    },

    rateLimited: function(){
        //TODO split this out into a non mongo file when we have one
    }
};

if(process.env.NODE_ENV === "test"){
    module.exports.models = models;
    module.exports.mongoose = require('mongoose');
}
