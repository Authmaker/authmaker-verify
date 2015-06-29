var mongoose = require('mongoose');
var Q = require('q');
var winston = require('winston');
var _ = require('lodash');

var modelName = 'Account';

var accountSchema = new mongoose.Schema({
    stripeId: String,
    name: String,
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    planExpiryDate: Date,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    collection: 'accounts'
});

accountSchema.methods.getPlans = function() {

    return Q.ninvoke(this, 'populate', 'plans').then(function(account) {
        var promises = account.plans.map(function(plan) {
            return Q.ninvoke(plan.plan, 'populate', 'scopeDocuments');
        });

        return Q.all(promises).then(function() {
            return account.plans;
        });
    });
};

accountSchema.methods.setPlanExpiryDate = function(planName, expiryDate) {

    winston.info("Updating account plan", {
        planName: planName,
        expiryDate: expiryDate,
        accountId: this._id
    });

    var plan;
    return Q.fcall(function() {
            return Q.ninvoke(this, 'populate', 'plans.plan users');
        }.bind(this))
        .then(function() {
            return this.model('StripePlan').findOne({
                stripePlan: planName
            }).exec();
        }.bind(this))
        .then(function(stripePlan) {

            if (!stripePlan) {
                throw new Error('Cannot subscribe to unknown plan ' + planName);
            }

            //get the plan from this account
            plan = _(this.plans).find(function(plan) {
                return plan.plan.stripePlan === planName;
            });

            if (plan) {
                winston.info("Updating account's existing plan information", {
                    accountId: this._id.toString(),
                    newExpiryDate: expiryDate,
                    planName: planName
                });
                plan.expiryDate = expiryDate;
                plan.updatedAt = new Date();
            } else {
                winston.info("Subscribing account to new plan", {
                    accountId: this._id.toString(),
                    newExpiryDate: expiryDate,
                    planName: planName
                });

                plan = {
                    "name": planName,
                    "plan": stripePlan,
                    "expiryDate": expiryDate,
                };

                this.plans.push(plan);
            }

            return Q.ninvoke(this, 'save');
        }.bind(this))
        .then(function() {
            var promises = this.users.map(function(user) {
                this.model('Oauth_Session').update({
                    userId: user.id,
                    scopes: plan.plan.scopes //only update sessions with exactly the same scopes
                }, {
                    "$set": {
                        expiryDate: expiryDate
                    }
                }, {
                    multi: true // catch all sessions
                }).exec();
            }.bind(this));

            return Q.all(promises);

        }.bind(this))
        .then(null, function(err) {
            winston.error("Error calling setPlanExpiryDate", {
                error: err.message,
                stack: err.stack,
                planName: planName,
                expiryDate: expiryDate
            });
            throw err;
        });
};

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
    module.exports.modelObject = mongoose.model(modelName);
} else {
    module.exports.modelObject = mongoose.model(modelName, accountSchema);
}
