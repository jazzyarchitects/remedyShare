/**
 * Created by Jibin_ism on 09-Dec-15.
 */
var mongoose = require('mongoose');
var Client = requireFromModule('clients/clientModel');
var uuid = require('node-uuid');
var Hash = requireFromModule('clients/cryptoOperations');

var newClient = function (user, service, callback) {
    Client.findOne({user: user._id, service: service}, function (err, doc) {
        var id = uuid.v4();
        var api_key = uuid.v4();
        if (doc) {
            Hash.hashKey(api_key, function (result) {
                if (result.success) {
                    var client = {
                        user: user._id,
                        key: result.hash,
                        id: id,
                        service: service
                    };
                    Client.update({user: user._id},client,function(err, doc){
                       if(doc){
                           callback(client);
                       } else{
                           callback({error: true, err: err});
                       }
                    });
                } else {
                    callback(errorJSON(501, result.error));
                }
            });
        } else {
            Hash.hashKey(api_key, function (result) {
                if (result.success) {
                    var client = new Client({
                        user: user._id,
                        key: result.hash,
                        id: id,
                        service: service
                    });
                    client.save(function (err) {
                        if (err) {
                            //console.log("Client save error");
                            callback({error: true, err: err});
                        } else {
                            callback(client);
                        }
                    });
                } else {
                    callback(errorJSON(501, result.error));
                }
            });
        }
    });
};

var authorize = function (id, key, callback) {
    Client.findOne({id: id, key: key}, function (err, doc) {
        if (doc) {
            // authorized
            callback(true, doc);
        } else {
            console.log(err +" "+doc);
            callback(false, errorJSON(602, "AUTHENTICATION_ERROR", "INVALID_KEY"));
        }
    });
};

var logout = function (user, callback) {
    Client.remove({user: user._id}, function (err, doc) {
        if (!doc) {
            callback(errorJSON(501, err));
        }else{
            callback({success: true});
        }
    });
};

var exportForBackup = function(callback){
  Client.find({}, function(err, doc){
     if(err){
         console.log("Error exporting clients:" +err);
         callback(errorJSON(501, "GENERAL_ERROR_-_CLIENT_EXPORT", err));
     } else{
         callback(successJSON(doc));
     }
  });
};

var importBackup = function(clients, callback){
    Client.create(clients, function(err, doc){
        if(err){
            console.log("Erorr importing clients: "+JSON.stringify(err));
            callback(errorJSON(501,"ERROR_IMPORTING_CLIENT_BACKUP", err));
        } else{
            callback({success: true});
        }
    });
};

exports.authenticate = authorize;
exports.createNewClient = newClient;
exports.logout = logout;
exports.exportForBackup = exportForBackup;
exports.importBackup = importBackup;