/**
 * Created by Jibin_ism on 09-Dec-15.
 */
var mongoose = require('mongoose');
var Client = requireFromModule('clients/clientModel');
var uuid = require('node-uuid');
var Hash = requireFromModule('clients/cryptoOperations');

var newClient = function (user, callback) {
    Client.findOne({user: user._id}, function (err, doc) {
        var id = uuid.v4();
        var api_key = uuid.v4();
        if (doc) {
            Hash.hashKey(api_key, function (result) {
                if (result.success) {
                    var client = {
                        user: user._id,
                        key: result.hash,
                        id: id
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
                        id: id
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
            callback(true, doc.user);
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
            callback(true);
        }
    });
};

exports.authenticate = authorize;
exports.createNewClient = newClient;
exports.logout = logout;