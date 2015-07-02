var _ = require("lodash");

var checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoVerify(access_token, tag) {
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
};
