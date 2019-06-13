const nconf = require('nconf');
const common = require('@authmaker/common');

const authmakerVerify = rootRequire('./index');

nconf.defaults({
  authmaker: {
    mongo: {
      db: 'authmaker-verify-test',
      host: 'localhost',
      port: 27017,
    },
  },
});

before(function () {
  return authmakerVerify.init(nconf);
});

after(function () {
  return common.getConnection().then(connection => connection.close());
});
