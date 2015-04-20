var mongoose = require('mongoose');

var modelName = 'OAuthSession';

var oauthSessionSchema = mongoose.Schema({
    access_token: String,
    client_id: String,
    code: String,
    redirect_uri: String,
    state: String,
    type: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scopes: [String],
    expiryDate: Date
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, oauthSessionSchema);
}
