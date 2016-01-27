/**
 * Created by Jibin_ism on 27-Jan-16.
 */


var mongoose = require('mongoose');
var User = requireFromModule('users/userModel');

var exportForBackup = function (callback) {
    User.find({},"+password", function (err, doc) {
        if (err) {
            console.log("Error exporting users: " + JSON.stringify(err));
            callback(errorJSON(501, "GENERAL_ERROR_-_MONGOOSE_ERROR", err));
        } else {
            callback(successJSON(doc));
        }
    });
};


var importBackup = function(users, callback){
    User.create(users, function(err, doc){
        if(err){
            console.log("Erorr importing users: "+JSON.stringify(err));
            callback(errorJSON(501,"ERROR_IMPORTING_USER_BACKUP", err));
        } else{
            callback({success: true});
        }
    });
};

exports.exportForBackup = exportForBackup;
exports.importBackup = importBackup;