var mongoose = require('mongoose');

var modelName = 'AuditTrail';

var auditTrailSchema = mongoose.Schema({
    access_token: String,
    tag: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, auditTrailSchema);
}
