'use strict';

var fs = require('fs');
var path = require('path');
//Walk through the module files
var walk = function (moduleDirectory, walkDirectory, callback) {
    if (!callback) {
        callback = requireFromModule;
    }
    // console.log(moduleDirectory);
    fs.readdirSync(moduleDirectory).forEach(function (dir) {
        var dirPath = path.join(moduleDirectory, dir);
        var dirStat = fs.statSync(dirPath);
        if (dirStat.isDirectory()) {
            // console.log(dirStat);
            var walkPath = path.join(dirPath, walkDirectory);
            fs.readdirSync(walkPath).forEach(function (file) {
                var filePath = path.join(walkPath, file);
                var fileStat = fs.statSync(filePath);
                if (fileStat.isFile() && /(.*)\.(js)$/.test(file)) {
                    var modulePath = path.join(dir, walkDirectory, file);
                    callback(modulePath);
                }
            });
        }
    });
};

var requireFromModule = function (filePath, callback) {
    module.paths.push('./modules');
    if (!callback)
        callback = require;
    return callback(filePath);
};

var successJSON = function (data) {
    return {success: true, data: data};
};

var errorJSON = function (errorCode, description, message) {
    //console.log("Error: " + JSON.stringify({
    //        error: true,
    //        errorCode: errorCode || 501,
    //        description: description || "INTERNAL_USE_ONLY",
    //        message: message || "FOR_ADMIN_EMAIL_AT_:_JAZZY.ARCHITECTS@GMAIL.COM"
    //    }));
    createErrorLog(description, message);
    return {
        success: false,
        error: true,
        errorCode: errorCode || 501,
        description: description || "INTERNAL_USE_ONLY",
        message: message || "FOR_ADMIN_EMAIL_AT_:_JAZZY.ARCHITECTS@GMAIL.COM"
    };
};

function createErrorLog(description, message) {
    var fileName = (new Date()).getTime().toString();
    var data = "{\"errror\":{\"description\":\"" + description + "\",\"message\":" + JSON.stringify(message)+"}}";
    fs.writeFile('./logFiles/' + fileName + '.json', data, {flag: 'w'}, function (err) {
        // console.log(err);
    });
}

var authenticateUser = function (req, res, callback) {
    var ckey, cid;
    if (req.cookies) {
        try {
            var userCookie = JSON.parse(req.cookies.user);
            ckey = userCookie.key;
            cid = userCookie.id;
        } catch (Err) {
            ckey = null;
            cid = null;
        }
    }

    var key = req.headers['x-access-key'] || ckey;
    var id = req.headers['x-access-id'] || cid;
    //console.log("Authenticating user in util: "+key+" "+id);

    req.guestUser = req.cookies.guest;

    var ClientOperations = requireFromModule('clients/operations');
    if (key && id) {
        ClientOperations.authenticate(id, key, function (success, doc) {
            req.authenticated = success;
            if (success) {
                callback(successJSON({user: doc.user, admin: doc.admin}));
            } else {
                callback(errorJSON({}));
            }
        });
    } else {
        req.authenticated = false;
        callback(errorJSON(601, "AUTHENTICATION_ERROR", "NOT_LOGGED_IN"));
    }
};

var printRoutes = function (router, outputFileName, isNotApi) {
    if(process.env.NODE_ENV==="development" || !process.env.NODE_ENV){
        fs.writeFileSync('./tmp/routes/' + (isNotApi ? '' : 'api-') + (outputFileName || 'routes.json'), JSON.stringify(router.stack), 'utf-8')
    };
};

exports.walk = walk;
exports.requireFromModule = requireFromModule;
exports.successJSON = successJSON;
exports.errorJSON = errorJSON;
exports.authenticateUser = authenticateUser;
exports.printRoutes = printRoutes;
