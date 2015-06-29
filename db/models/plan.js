var mongoose = require('mongoose');

var modelName = 'Plan';

var planSchema = new mongoose.Schema({
    name: String,
    stripePlan: String,
    scopes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scope'
    }],
    newSubscriptions: Boolean,
    lowValue: Boolean
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, planSchema);
}
