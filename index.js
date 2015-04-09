var moment = require('moment');

var db = require('./db');
var models = require('./db/models');

module.exports = {
    mongo: function(access_token){
        console.log("got this far");

        return models.oauthSession.findOne({
            access_token: access_token
        }).exec().then(function(session){

            if(!session){
                throw new Error("Not Authorized: session not found with that access token");
            }

            if(!session.expiryDate){
                throw new Error("Not Authorized: invlid session - expriryDate not set");
            }

            if(moment(session.expiryDate).isBefore()){
                throw new Error("Not Authorized: session has expired");
            }

            return session;
        });
    },
    connectMongo: function(nconf){
        //initialise the db
        db(nconf);
    }
};
