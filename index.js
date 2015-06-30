var moment = require('moment');

var db = require('./db');
var models = require('./db/models');
var _ = require('lodash');
var moment = require('moment');

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
    mongo: function(access_token, tag) {
        return checkAccessToken(access_token)
        .then(function(session) {
            // just return the session if there is no tag
            if (!tag) {
                return session;
            }

            var scope = _.find(session.scopes, function(scope) {
                if(scope === tag) {
                    throw new Error("Incorrect Tag: Only tag name required to be passed from " + scope);
                }
                return scope.startsWith(tag);
            });

            if (!scope) {
                throw new Error("Not Authorized: No scope associated with " + tag);
            }

            return models.auditTrail.create({
                access_token: access_token,
                tag: scope,
                userId: session.userId,
                date: new Date()
            }).then(function() {
                return session;
            });
        });
    },
    connectMongo: function(nconf) {
        //initialise the db
        db(nconf);
    }
};

function checkAccessToken(access_token) {
    return models.oauthSession.findOne({
            access_token: access_token
        }).exec().then(function(session) {
            if (!session) {
                throw new Error("Not Authorized: session not found with that access token");
            }

            if (!session.expiryDate) {
                throw new Error("Not Authorized: invlid session - expriryDate not set");
            }

            if (moment(session.expiryDate).isBefore()) {
                throw new Error("Not Authorized: session has expired");
            }

            return session;
        });
}

if(process.env.NODE_ENV === "test"){
    module.exports.models = models;
    module.exports.mongoose = require('mongoose');
}
