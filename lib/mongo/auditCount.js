var moment = require('moment');

var getModel = require('authmaker-common').getModel;

var checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoVerify(access_token, tag, since) {
    return checkAccessToken(access_token).then(function(session) {
        var query = {
            tag: tag,
            userId: session.userId
        };

        if (since) {
            query.date = {
                $gt: moment(since).toDate()
            };
        }
        return getModel('auditTrail').then(function(auditTrail) {
            return auditTrail.find(query).count().exec();
        });
    });
};
