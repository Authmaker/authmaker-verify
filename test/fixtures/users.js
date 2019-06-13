/* eslint-disable no-console */

const moment = require('moment');
const Q = require('q');
const mongoose = require('mongoose');

const authmakerVerify = rootRequire('./index');

const usersToCreate = [{
  _id: mongoose.Types.ObjectId(),
  username: 'testuser1@stonecircle.io',
  clientId: 'testChatsFixture',
}];

const sessionsToCreate = [{
  accessToken: 'valid_access_token_1',
  expiry: moment().add(1, 'hours').toDate(),
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'valid_face_permission',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_permissions'],
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'expired_access_token',
  expiry: moment().subtract(1, 'seconds').toDate(),
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'valid_rate_limit_5_days',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_limit_5_days'],
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'valid_rate_limit_5_days_user2',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_limit_5_days'],
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'valid_rate_limit_5_second',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_limit_5_seconds'],
  userId: mongoose.Types.ObjectId(),
}, {
  accessToken: 'valid_rate_limit_5_days_user3_access_token1',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_limit_5_seconds'],
  userId: usersToCreate[0]._id,
}, {
  accessToken: 'valid_rate_limit_5_days_user3_access_token2',
  expiry: moment().add(1, 'hours').toDate(),
  scopes: ['face_limit_5_seconds'],
  userId: usersToCreate[0]._id,
}];

function init() {
  return authmakerVerify.models.oauthSession.create(sessionsToCreate)
    .then(() => authmakerVerify.models.user.create(usersToCreate));
}

function reset() {
  // only allow this in test
  if (process.env.NODE_ENV === 'test') {
    return authmakerVerify.getConnection().then((connection) => {
      const collections = connection.collections;

      const promises = Object.keys(collections).map(collection => Q.ninvoke(collections[collection], 'deleteMany'));

      return Q.all(promises);
    });
  }
  const errorMessage = 'Excuse me kind sir, but may I enquire as to why you are currently running reset() in a non test environment? I do propose that it is a beastly thing to do and kindly ask you to refrain from this course of action. Sincerely yours, The Computer.';
  console.log(errorMessage);
  console.error(errorMessage);
  throw new Error(errorMessage);
}

module.exports = {
  init,
  reset,
};
