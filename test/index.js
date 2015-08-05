var nconf = require('nconf');
var authmakerVerify = rootRequire('./index');

nconf.defaults({
    "mongo": {
        "authmaker": {
            "db": "authmaker-verify-test",
            "host": "localhost",
            "port": 27017
        }
    }
});

before(function() {
    authmakerVerify.connectMongo(nconf);
});
