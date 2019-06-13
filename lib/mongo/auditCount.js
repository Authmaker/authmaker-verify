const moment = require('moment');
const common = require('@authmaker/common');

const checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoVerify(accessToken, tag, since) {
  return checkAccessToken(accessToken).then((session) => {
    const query = {
      tag,
      userId: session.userId,
    };

    if (since) {
      query.date = {
        $gt: moment(since).toDate(),
      };
    }
    return common.models.auditTrail.find(query).countDocuments().exec();
  });
};
