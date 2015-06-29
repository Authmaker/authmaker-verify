var moment = require('moment');

var db = require('./db');
var models = require('./db/models');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
    mongoRateLimited: function(access_token, tag) {
        return checkAccessToken(access_token)
        .then(function(session){

            var scope = _.find(session.scopes, function(scope) {
                return scope.includes(tag);
            });

            var scopeParts = scope.split('_');
            var limit = scopeParts[2];
            var period = scopeParts[3];

            return models.auditTrail.find({
                tag: scope,
                date: {
                    $gte: moment().subtract(limit, period)
                }
            }).count().exec().then(function(count) {
                if (count > limit) {
                    throw new Error("Rate limit exceeded");
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
        });
    },
    mongo: function(access_token, tag) {
        return checkAccessToken(access_token)
        .then(function(session) {
            // just return the session if there is no tag
            if (!tag) {
                return session;
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
