var moment = require('moment');
var mongoose = require('mongoose');
var Q = require('q');

var models = rootRequire('./db/models');

// var usersToCreate = [{
//     _id: mongoose.Types.ObjectId(),
//     username: 'testuser1@bloo.ie',
//     clientId: 'testChatsFixture',
//     date: moment().subtract(1, 'hours').toDate()
// }];

var sessionsToCreate = [{
    access_token: "valid_access_token_1",
    expiryDate: moment().add(1, 'hours').toDate()
}, {
    access_token: 'expired_access_token',
    expiryDate: moment().subtract(1, 'seconds').toDate()
}];

function init() {
    return models.oauthSession.create(sessionsToCreate);
}

function reset() {
    //only allow this in test
    if (process.env.NODE_ENV === 'test') {
        var collections = mongoose.connection.collections;

        var promises = Object.keys(collections).map(function(collection) {
            return Q.ninvoke(collections[collection], 'remove');
        });

        return Q.all(promises);
    } else {
        var errorMessage = 'Excuse me kind sir, but may I enquire as to why you are currently running reset() in a non test environment? I do propose that it is a beastly thing to do and kindly ask you to refrain from this course of action. Sincerely yours, The Computer.';
        console.log(errorMessage);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

module.exports = {
    init: init,
    reset: reset,
    models: models
};
