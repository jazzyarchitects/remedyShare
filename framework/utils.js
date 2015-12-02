
'use strict';

var fs = require('fs');
var path = require('path');
//Walk through the module files
var walk = function (moduleDirectory, walkDirectory, callback) {
    if (!callback) {
        callback = requireFromModule;
    }
    console.log(moduleDirectory);
    fs.readdirSync(moduleDirectory).forEach(function (dir) {
        var dirPath = path.join(moduleDirectory, dir);
        var dirStat = fs.statSync(dirPath);
        if (dirStat.isDirectory() ) {
            console.log(dirStat);
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

var successJSON=function(data){
    if(data) {
        return JSON.stringify({success: true, data: data});
    }else{
        return JSON.stringify({success:true});
    }
};

var errorJSON=function(errorCode, data, optionalDescription){
    return JSON.stringify({success: false, error: true, errorCode: errorCode, message:data, description: optionalDescription});
};

exports.walk = walk;
exports.requireFromModule = requireFromModule;
exports.successJSON=successJSON;
exports.errorJSON=errorJSON;