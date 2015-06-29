var moment = require('moment');

var db = require('./db');
var models = require('./db/models');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
    mongo: function(access_token, tag) {
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
            })
            .then(function(session) {
                // just return the session if there is no tag
                if (!tag) {
                    return session;
                }

                var audit = new models.auditTrail({
                    access_token: access_token,
                    tag: tag,
                    userId: session.userId,
                    date: new Date()
                });

                var isLimited, limit, period;
                _.forEach(session.scopes, function(scope) {
                    if (scope.includes(tag)) {
                        var parts = scope.split('_');
                        if (parts[1] === "limit") {
                            isLimited = true;
                            limit = parts[2];
                            period = parts[3];
                        } else {
                            audit.tag = scope;
                        }
                        return false;
                    }
                });

                if (!isLimited) {
                    return audit.save().then(function() {
                        return session;
                    });
                }

                return models.auditTrail.find({
                    tag: tag,
                    date: {
                        $gte: moment().subtract(limit, period)
                    }
                }).count().exec().then(function(count) {
                    if (count > limit) {
                        throw new Error("Rate limit exceeded");
                    }

                    return audit.save().then(function() {
                        return session;
                    });
                });
            });
    },
    connectMongo: function(nconf) {
        //initialise the db
        db(nconf);
    }
};

if(process.env.NODE_ENV === "test"){
    module.exports.models = models;
    module.exports.mongoose = require('mongoose');
}
