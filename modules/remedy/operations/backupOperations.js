/**
 * Created by Jibin_ism on 28-Dec-15.
 */
var Remedy = requireFromModule('remedy/remedyModel');
var aync = require('async');
/**
 * Import Export Operations
 */
var importFromJSON = function (user, remedies, callback) {
    async.each(remedies, function (remedy, asyncCallback) {
        if (typeof remedy !== 'object') {
            asyncCallback();
        }
        var remedyObject = remedy;
        delete remedyObject._id;
        delete remedyObject.author;
        remedyObject.author = user;

        remedy = new Remedy(remedyObject);
        remedy.save(function (err, doc) {
            if (err) {
                //console.log("Error importing: " + JSON.stringify(err));
            }
            asyncCallback();
        });
    }, function (err) {
        if (err) {
            callback(errorJSON(501, "GENERAL_ERROR", "ERROR_IMPORTING_FROM_JSON"));
        } else {
            Remedy.find({"author": user}).select("title _id").exec(function (err, doc) {
                if (err) {
                    callback(errorJSON(501, "GENERAL_ERROR", "ERROR R-OPERATIONS: importFromJSON"));
                } else {
                    callback(successJSON(doc));
                }
            });
        }
    });
};

var exportForBackup = function (callback) {
    Remedy.find({}, function (err, doc) {
        if(err){
            //console.log("Error Exporting Remedy: "+JSON.stringify(err));
            callback(errorJSON(501, "GENERAL_ERROR_-_EXPORTING_REMEDY", err));
        }else{
            for(var i=0;i<doc.length;i++){
                if(doc[i].image.path) {
                    doc[i].image.path = doc[i].image.path.toString().replace(/\\"/g,"").replace(/\\/g, "\\\\");
                }
            }
            callback(successJSON(doc));
        }
    });
};

var importBackup = function(remedies, callback){
    Remedy.create(remedies, function(err, doc){
        if(err){
            //console.log("Erorr importing remedies: "+JSON.stringify(err));
            callback(errorJSON(501,"GENERAL_ERROR_-_ERROR_IMPORTING_REMEDY_BACKUP", err));
        } else{
            callback({success: true});
        }
    });
};


exports.ImportFromJSON = importFromJSON;
exports.ExportForBackup = exportForBackup;
exports.ImportBackup = importBackup;
