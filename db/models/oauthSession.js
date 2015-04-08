var mongoose = require('mongoose');

var modelName = 'OAuthSession';

var oauthSessionSchema = mongoose.Schema({
    access_token: String,
    client_id: String,
    code: String,
    redirect_uri: String,
    state: String,
    type: String,
    userId: String,
    scopes: [String],
    expiryDate: Date,

    //deprecated
    type_id: Number,
    expiry_date: Date
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, oauthSessionSchema);
}
