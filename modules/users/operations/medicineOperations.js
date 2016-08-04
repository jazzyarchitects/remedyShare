var User = requireFromModule('users/userModel');
var Medicine = requireFromModule('medicine/MedicineModel');
var mongoose = require('mongoose');
var async = require('async');

var linkMedicine = function (medicine, user_id, callback) {
    User.update({_id: user_id}, {
        $set: {
            $inc: {"stats.medicines": 1},
            $push: {medicines: medicine._id}
        }
    }, function (err, doc) {
        if (err) {
            callback(errorJSON(601, "Mongo erorr: Unable to link medicine to user", err));
        } else {
            callback(successJSON(doc));
        }
    });
};

var linkMedicines = function (medicines, user_id, callback) {
    async.forEach(medicines, function (medicine, callback) {
        User.update({_id: user_id}, {
            $set: {
                $inc: {"stats.medicines": 1},
                $push: {medicines: medicine._id}
            }
        }, function (err, result) {
            callback(err, result)
        });
    }, function (errs, results) {
        // console.log("Linking medicines: " + JSON.stringify(errs) + " \n\n" + JSON.stringify(results));
        if (errs) {
            // console.log("Linking medicines: Error: " + JSON.stringify(errs));
            callback(errorJSON(601, "mongo-errors", errs));
        } else {
            callback(successJSON(results));
        }
    });
};

var getMedicines = function (user_id, callback) {
    User.find({_id: user_id})
        .populate({
            path: "medicines",
            match: {active: true}
        })
        .exec(function (err, doc) {
            if (err) {
                callback(errorJSON(601, "Mongo error - getting medicines for user", err));
            } else {
                callback(successJSON(doc));
            }
        });
};

var linkMedicinesToUserFromAppBackup = function (user_id, callback) {
    User.update({
        _id: user_id
    },{
        $set: {
            medicines: []
        }
    }, function(err, doc){
        Medicine.find({user: user_id})
            .exec(function(err, meds){
                if(err){
                    callback(errorJSON(601, "Mongo error - linking medicine to user", err));
                } else{
                    var medicineIds = [];
                    meds.forEach(function(med){
                       medicineIds.push(med._id);
                    });
                    User.update({_id: user_id},{
                        $pushAll: {medicines: medicineIds}
                    }, function(err, doc){
                        callback(err, meds);
                    //}
                    //async.each(meds, function(med, callback){
                    //    User.update({_id: user_id},{
                    //        $push: {medicines: med._id}
                    //    }, function(err, doc){
                    //        callback(err, med)
                    //    })
                    //}, function(errs, results){
                    //    callback(errs, results);
                    })
                }
            });
    });
};

exports.linkMedicine = linkMedicine;
exports.linkMedicines = linkMedicines;
exports.getMedicines = getMedicines;
exports.linkMedicinesToUserFromAppBackup = linkMedicinesToUserFromAppBackup;
