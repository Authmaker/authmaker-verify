var authmakerCommon = require('authmaker-common');

var mongoAuditCount = require('./lib/mongo/auditCount');
var mongoRateLimited = require('./lib/mongo/rateLimited');
var mongoVerify = require('./lib/mongo/verify');


module.exports = {
    mongo: mongoVerify,
    mongoAuditCount: mongoAuditCount,
    mongoRateLimited: mongoRateLimited,

    connectMongo: function(nconf) {
        //initialise the db
        authmakerCommon.init(nconf);
    },

    rateLimited: function() {
        //TODO split this out into a non mongo file when we have one
    },

    getModel: authmakerCommon.getModel,
    getConnection: authmakerCommon.getConnection
};
