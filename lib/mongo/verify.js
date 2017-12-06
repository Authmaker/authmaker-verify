const _ = require('lodash');
const common = require('@authmaker/common');

const checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoVerify(accessToken, requiredScope) {
  return checkAccessToken(accessToken).then((session) => {
    // just return the session if there is no tag
    if (!requiredScope) {
      return session;
    }

    const scope = _.find(session.scopes, sessionScope => sessionScope === requiredScope);

    if (!scope) {
      throw new Error(`Not Authorized: No scope associated with ${requiredScope}`);
    }

    return common.models.auditTrail.create({
      accessToken,
      tag: scope,
      userId: session.userId,
      date: new Date(),
    }).then(() => session);
  });
};
