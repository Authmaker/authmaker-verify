var authmakerVerify = rootRequire('./index');

function success(req, res){
    return res.send("Success");
}

function getSession(req, res, next) {
        if(!req.headers.authorization){
            return res.status(401).send("Missing authorization header");
        }

        var accessToken = req.headers.authorization.split(/\s+/).pop();

        //verify the access-token
        return authmakerVerify.mongo(accessToken)
            .then(function(oauthSession){
                req.oauthSession = oauthSession;

                next();
            })
            .then(null, function(err){

                if (err.message.indexOf("Not Authorized") >= 0) {
                    res.status(401);
                } else {
                    res.status(500);
                }

                return res.send(err.message);
            });
    }


module.exports.autoroute = {
    get: {
        '/noverify': success,
        '/verify': [getSession, success],
        '/jointrated': [authmakerVerify.mongoRateLimited],
        '/splitrated': [authmakerVerify.mongo, authmakerVerify.rateLimited]
    }
};
