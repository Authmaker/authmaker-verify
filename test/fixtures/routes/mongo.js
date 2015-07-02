var authmakerVerify = rootRequire('./index');

function success(req, res){
    return res.send("Success");
}

module.exports.autoroute = {
    get: {
        '/noverify': success,
        '/verify': [authmakerVerify.mongo],
        '/jointrated': [authmakerVerify.mongoRateLimited],
        '/splitrated': []
    }
};
