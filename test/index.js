const nconf = require('nconf');

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

before(() => {
  authmakerVerify.init(nconf);
});
