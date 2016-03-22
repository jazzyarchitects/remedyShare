/**
 * Created by jibinmathews on 21/3/16.
 */

var Medicine = requireFromModule('medicine/MedicineModel');
var Doctor = requireFromModule('doctors/doctorModel');
var async = require('async');

var linkMedicinesFromBackup = function (user_id, callback) {
    //console.log("LinkingMedicine to Doctor for user: " + JSON.stringify(user_id));
    Doctor.find({user: user_id})
        .exec(function (err, docs) {
            //console.log("Found doctors for user: " + JSON.stringify(docs));
            if (err) {
                callback(errorJSON(601, "mongo error - finding doctors for linking medicines", err));
            } else {
                async.each(docs, function (doc, callback) {
                    Medicine.find({user: user_id, appDoctorId: doc.appId})
                        .exec(function (err, meds) {
                            //console.log("Found medicine for above doctor and user: " + JSON.stringify(meds));
                            if (err) {
                                callback(errorJSON(601, "mongo error - finding medicine for linking medicines to doctors", err));
                            } else {
                                var medIds = [];
                                meds.forEach(function (med) {
                                    medIds.push(med._id);
                                });
                                Doctor.update({
                                    _id: doc._id
                                }, {
                                    $pushAll: {medicines: medIds}
                                }, function (err, res) {
                                    callback(err, res);
                                });
                                //async.each(meds, function (med, callback_c) {
                                //    //console.log("\n\nUpdating doctor to link medicine: " + JSON.stringify(med));
                                //    Doctor.update({
                                //        _id: doc._id
                                //    }, {
                                //        $push: {medicines: med._id}
                                //    }, function (err, res) {
                                //        callback_c(err, res);
                                //    })
                                //}, function (errs, resses) {
                                //    callback(errs, resses);
                                //});
                            }
                        });
                }, function (errs, results) {
                    callback(errs, results);
                });
            }
        });
};

exports.linkMedicinesFromBackup = linkMedicinesFromBackup;