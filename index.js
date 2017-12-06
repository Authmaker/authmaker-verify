'use strict';

const common = require('@authmaker/common');

const mongoAuditCount = require('./lib/mongo/auditCount');
const mongoRateLimited = require('./lib/mongo/rateLimited');
const mongoVerify = require('./lib/mongo/verify');


module.exports = {
  mongo: mongoVerify,
  mongoAuditCount,
  mongoRateLimited,

  init(nconf) {
    // initialise the db
    return common.init(nconf);
  },

  rateLimited() {
    // TODO split this out into a non mongo file when we have one
  },

  getConnection: common.getConnection,
  models: common.models,
};
