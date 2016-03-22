/**
 * Created by Jibin_ism on 06-Feb-16.
 */

var mongoose = require('mongoose');
var Medicine = requireFromModule('medicine/MedicineModel');
var async = require('async');

var insertMedicine = function (medicine, user, callback) {
    var medicine2 = new Medicine(medicine);
    medicine2.save(function (err, doc) {
        if (err) {
            callback(errorJSON(601, "Unable to save Medicine", err));
        } else {
            callback(successJSON(medicine2));
        }
    });
};

var insertMultipleMedicines = function (meds, callback) {
    var medicines = [];
    meds.forEach(function (med) {
        medicines.push(new Medicine(med));
    });
    Medicine.create(medicines, function (err, doc) {
        if (err) {
            callback(errorJSON(601, "Mongo error - unable to save medicines", err));
        } else {
            callback(successJSON(medicines));
        }
    });
};

var getAll = function (user_id, callback) {
    Medicine.find({active: true}).exec(function (err, doc) {
        if (err) {
            callback(errorJSON(601, "Mongo Error - querying all medicines", err));
        } else {
            callback(successJSON(doc));
        }
    });
};

var getMedicine = function (id, callback) {
    Medicine.findOne({_id: id})
        .populate({
            path: "user"
        })
        .exec(function (err, doc) {
            if (err) {
                callback(errorJSON(601, "Mongo error - getting medicine", err));
            } else {
                callback(successJSON(doc));
            }
        });
};

var finishDosage = function (medicine_id, callback) {
    Medicine.update({_id: medicine_id}, {$set: {active: false}}, function (err, doc) {
        if (err) {
            callback(errorJSON(601, "Mongo error", err));
        } else {
            callback(successJSON(doc));
        }
    })
};

function getMedicineObject(obj, user_id) {
    var medicine = {};
    medicine.name = obj.name;
    medicine.appId = obj.id;
    medicine.timings = {};
    medicine.timings.breakfast = obj.breakfast;
    medicine.timings.dinner = obj.dinner;
    medicine.timings.lunch = obj.lunch;
    medicine.timings.custom = obj.customTime.hour + ":" + obj.customTime.minute;
    medicine.icon = obj.icon;
    medicine.days = obj.days;
    medicine.endDate = obj.endDate;
    medicine.notes = obj.notes;
    medicine.user = user_id;
    medicine.appDoctorId = obj.doctor;

    return medicine;
}

//{
//    "dinner": "none",
//    "id": 1445163784346,
//    "icon": 54,
//    "customTime": {
//    "minute": -1,
//        "hour": -1
//},
//    "days": {
//    "saturday": true,
//        "wednesday": true,
//        "friday": true,
//        "tuesday": true,
//        "thursday": true,
//        "monday": true,
//        "sunday": true
//},
//    "breakfast": "after",
//    "name": "Embeta TM50",
//    "endDate": "indefinite",
//    "lunch": "none",
//    "notes": "",
//    "doctor": "0"
//},

var importFromAppBackup = function (meds, user_id, callback) {
    //console.log("importing medicine from app");
    Medicine.remove({user: user_id})
        .exec(function (err, doc) {
            async.each(meds, function (med, callback) {
                var medicine = new Medicine(getMedicineObject(med, user_id));
                medicine.save(function (err, doc) {
                    //console.log("Saving medicines: "+JSON.stringify(err)+"\n"+JSON.stringify(doc));
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, medicine);
                    }
                });
            }, function (errs, medicines) {
                //console.log("/medicine/crudOperations/importFromAppBackup: "+JSON.stringify(err)+"\n"+JSON.stringify(medicines));
                callback(errs, medicines);
            })
        });
};

exports.insertMedicine = insertMedicine;
exports.insertMultipleMedicines = insertMultipleMedicines;
exports.getAll = getAll;
exports.get = getMedicine;
exports.finishDosage = finishDosage;
exports.importFromAppBackup = importFromAppBackup;