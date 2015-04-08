var fs = require('fs');
var path = require('path');

var models = {};

fs.readdirSync(__dirname).forEach(function(fileName) {
    var extension = path.extname(fileName);
    if (extension === '.js' && fileName !== "index.js") {
        var required = require('./' + fileName);

        //add another api to get to these models
        if (required.modelObject) {
            models[fileName.slice(0, -3)] = required.modelObject;
        }
    }
});

module.exports = models;
