/**
 * Created by Jibin_ism on 25-Dec-15.
 */

var mongoose = require('mongoose');
var RemedyOperations = requireFromModule('remedy/operations');
var UserOperations = requireFromModule('users/operations');
var ClientOperations = requireFromModule('clients/operations');
var fs = require('fs');
var async = require('async');

var importDatabase = function (file, callback) {
    fs.readFile(file.path, function (err, data) {
        if(err){
            callback(errorJSON(501,"ERROR_READING_IMPORT_FILE", err));
            return;
        }
        data = JSON.parse(data);
        mongoose.connection.db.dropDatabase();
        var remedies = data.data.remedies;
        var users=data.data.users;
        var clients = data.data.clients;
        async.parallel([
            function(callback){
                RemedyOperations.importBackup(remedies, function(result){
                    if(result.success){
                        callback(null, true);
                        return;
                    }
                    callback(result);
                });
            },function(callback){
                UserOperations.importBackup(users, function(result){
                    if(result.success){
                        callback(null, true);
                        return;
                    }
                    callback(result);
                });
            },function(callback){
                ClientOperations.importBackup(clients, function(result){
                    if(result.success){
                        callback(null, true);
                        return;
                    }
                    callback(result);
                });

            }
        ],function(err, results){
            if(err){
                callback(errorJSON(501,"BACKUP_IMPORT_ERROR",err));
            }else{
                callback(successJSON("imported successfully"));
            }
        });
    });
};


var exportDatabase = function (callback) {
    async.parallel([
        function (callback) {
            UserOperations.exportForBackup(function (result) {
                if (result.success) {
                    callback(null, {key: "users", value: result.data});
                } else {
                    callback(result);
                }
            });
        },
        function (callback) {
            RemedyOperations.exportForBackup(function (results) {
                if (results.success) {
                    callback(null, {key: "remedies", value: results.data});
                } else {
                    callback(results);
                }
            });
        },
        function (callback) {
            ClientOperations.exportForBackup(function (results) {
                if (results.success) {
                    callback(null, {key: "clients", value: results.data});
                } else {
                    callback(results);
                }
            });
        }
    ], function (err, results) {
        if (err) {
            callback(errorJSON(501, "GENERAL_ERROR_-_ERROR_EXPORTING", err));
        } else {
            var data = {};
            //console.log("Controller backupObject: "+JSON.stringify(results)+"\nErrors:"+err);
            for (var i = 0; i < results.length; i++) {
                data[results[i].key] = results[i].value;
            }
            callback(successJSON(data));
        }
    });
};


exports.exportDatabase = exportDatabase;
exports.importDatabase = importDatabase;