var mongoose = require('mongoose');

var modelName = 'Scope';

var scopeSchema = new mongoose.Schema({
    name: String,
    scope: String,
    paidFor: Boolean,
    description: String,
    plan: String
});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, scopeSchema);
}
