var moment = require('moment');

var models = rootRequire('db/models');

module.exports = function checkAccessToken(access_token) {
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
};
