var moment = require('moment');

var getModel = require('authmaker-common').getModel;

module.exports = function checkAccessToken(access_token) {
    return getModel('oauthSession').then(function(oauthSession) {
        return oauthSession.findOne({
            access_token: access_token
        }).exec();
    })

    .then(function(session) {
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
