var _ = require("lodash");

var getModel = require('authmaker-common').getModel;

var checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoVerify(access_token, requiredScope) {
    return checkAccessToken(access_token).then(function(session) {
        // just return the session if there is no tag
        if (!requiredScope) {
            return session;
        }

        var scope = _.find(session.scopes, function(scope) {
            return scope === requiredScope;
        });

        if (!scope) {
            throw new Error("Not Authorized: No scope associated with " + requiredScope);
        }

        return getModel('auditTrail').then(function(auditTrail) {
            return auditTrail.create({
                access_token: access_token,
                tag: scope,
                userId: session.userId,
                date: new Date()
            }).then(function() {
                return session;
            });
        });
    });
};
