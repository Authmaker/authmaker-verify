const moment = require('moment');
const common = require('@authmaker/common');

module.exports = function checkAccessToken(accessToken) {
  return common.models.oauthSession.findOne({
    accessToken,
  }).exec().then((session) => {
    if (!session) {
      throw new Error('Not Authorized: session not found with that access token');
    }

    if (!session.expiry) {
      throw new Error('Not Authorized: invalid session - expiry not set');
    }

    if (moment(session.expiry).isBefore()) {
      throw new Error('Not Authorized: session has expired');
    }

    return session;
  });
};
