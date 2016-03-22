/**
 * Created by jibinmathews on 21/3/16.
 */

var User = requireFromModule('users/userModel');
var Doctor = requireFromModule('doctors/doctorModel');
var async = require('async');

var linkDoctor = function (doctor_id, user_id, callback) {
    User.update({_id: user_id}, {$set: {$push: {doctors: doctor_id}}}, function (err, doc) {
        if (err) {
            callback(errorJSON(601, "mongo error - linking doctor to user", err));
        } else {
            callback(successJSON(true));
        }
    });
};

var linkDoctorsToUserFromAppBackup = function (user_id, callback) {
    User.update({_id: user_id},{
        $set:{
            doctors: []
        }
    }, function(err, doc){
        Doctor.find({user: user_id})
            .exec(function (err, docs) {
                if (err) {
                    callback(errorJSON(601, "Mongo error - linking doctors to users from app backup"));
                } else {
                    var docIds = [];
                    docs.forEach(function(doc){
                       docIds.push(doc._id);
                    });
                    User.update({_id: user_id},{
                        $pushAll: {
                            doctors: docIds
                        }
                    }, function(err, res){
                        callback(err, res);
                    //}
                    //async.each(docs, function (doc, callback) {
                    //    User.update({_id: user_id},{
                    //        $push: {
                    //            doctors: doc._id
                    //        }
                    //    }, function(err, res){
                    //        callback(err, res);
                    //    });
                    //}, function (errs, results) {
                    //    callback(errs, results);
                    })
                }
            });
    });
};


exports.linkDoctor = linkDoctor;
exports.linkDoctorsToUserFromAppBackup = linkDoctorsToUserFromAppBackup;