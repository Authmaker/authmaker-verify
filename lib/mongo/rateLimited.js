const _ = require('lodash');
const moment = require('moment');
const common = require('@authmaker/common');


const checkAccessToken = require('../common/checkAccessToken');

module.exports = function mongoRateLimited(accessToken, tag, defaultScope) {
  return checkAccessToken(accessToken)

    .then((session) => {
      if (!tag) {
        throw new Error('Incorrect parameter: Missing tag in arguments passed');
      }

      let scope = _.find(session.scopes, (sessionScope) => {
        if (sessionScope === tag) {
          throw new Error(`Incorrect parameter: Only tag name required to be passed from ${sessionScope}`);
        }
        return sessionScope.indexOf(tag) === 0;
      });

      if (!scope && defaultScope) {
        scope = defaultScope;
      }

      if (!scope) {
        throw new Error(`Not Authorized: No scope associated with ${tag}`);
      }

      const scopeParts = scope.split('_');

      if (scopeParts.length !== 4) {
        throw new Error(`Malformed Scope: ${scope} is not a rate limited scope. e.g. tagname_limit_10_day`);
      }

      const limit = scopeParts[2].trim();
      const period = scopeParts[3].trim();

      return common.models.auditTrail.find({
        tag,
        userId: session.userId,
        date: {
          $gt: moment().subtract(1, period).toDate(),
        },
      }).count().exec().then((count) => {
        if (count >= limit) {
          throw new Error(`Too Many Requests: Rate limit exceeded for ${scope}`);
        }

        return common.models.auditTrail.create({
          accessToken,
          tag,
          userId: session.userId,
          date: new Date(),
        }).then(() => session);
      });
    });
};
