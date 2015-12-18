var moment = require('moment');
var Q = require('q');
var mongoose = require('mongoose');

var authmakerVerify = rootRequire('./index');
var getModel = authmakerVerify.getModel;

var usersToCreate = [{
    _id: mongoose.Types.ObjectId(),
    username: 'testuser1@bloo.ie',
    clientId: 'testChatsFixture'
}];

var sessionsToCreate = [{
    access_token: "valid_access_token_1",
    expiryDate: moment().add(1, 'hours').toDate(),
    userId: mongoose.Types.ObjectId()
}, {
    access_token: "valid_face_permission",
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_permissions'],
    userId: mongoose.Types.ObjectId()
}, {
    access_token: 'expired_access_token',
    expiryDate: moment().subtract(1, 'seconds').toDate(),
    userId: mongoose.Types.ObjectId()
}, {
    access_token: 'valid_rate_limit_5_days',
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_limit_5_days'],
    userId: mongoose.Types.ObjectId()
}, {
    access_token: 'valid_rate_limit_5_days_user2',
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_limit_5_days'],
    userId: mongoose.Types.ObjectId()
}, {
    access_token: 'valid_rate_limit_5_second',
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_limit_5_seconds'],
    userId: mongoose.Types.ObjectId()
}, {
    access_token: 'valid_rate_limit_5_days_user3_access_token1',
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_limit_5_seconds'],
    userId: usersToCreate[0]._id
}, {
    access_token: 'valid_rate_limit_5_days_user3_access_token2',
    expiryDate: moment().add(1, 'hours').toDate(),
    scopes: ['face_limit_5_seconds'],
    userId: usersToCreate[0]._id
}];

function init() {
    return getModel('oauthSession').then(function(oauthSession){
        return oauthSession.create(sessionsToCreate);
    }).then(function(){
        return getModel('user').then(function(user){
            return user.create(usersToCreate);
        });
    });
}

function reset() {
    //only allow this in test
    if (process.env.NODE_ENV === 'test') {
        return authmakerVerify.getConnection().then(function(connection){
            var collections = connection.collections;

            var promises = Object.keys(collections).map(function(collection) {
                return Q.ninvoke(collections[collection], 'remove');
            });

            return Q.all(promises);
        });

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
    getModel: getModel
};
