var mongoose = require('mongoose');

var modelName = 'ExternalIdentity';

var externalIdentitySchema = mongoose.Schema({
    externalId: String,
    username: String,
    displayName: String,
    provider: String,
    rawProfile: mongoose.Schema.Types.Mixed,
    authTokens: mongoose.Schema.Types.Mixed
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, externalIdentitySchema);
}
