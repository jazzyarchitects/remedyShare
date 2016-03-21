/**
 * Created by Jibin_ism on 06-Feb-16.
 */

var mongoose = require('mongoose');
var Medicine = requireFromModule('medicine/MedicineModel');

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

exports.insertMedicine = insertMedicine;
exports.insertMultipleMedicines = insertMultipleMedicines;
exports.getAll = getAll;
exports.get = getMedicine;
exports.finishDosage = finishDosage;