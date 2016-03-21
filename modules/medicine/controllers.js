/**
 * Created by Jibin_ism on 06-Feb-16.
 */

var MedicineOperations = requireFromModule('medicine/operations');
var UserOperations = requireFromModule('users/operations');


function getMedicine(req) {
    var medicine = {};

    if (req.body.medicine) {
        var temp = JSON.parse(req.body.medicine);
        medicine.name = temp.name;
        medicine.endDate = temp.endDate;
        medicine.note = temp.notes;
        medicine.days = JSON.parse(temp.days);
        medicine.timings = {};
        medicine.timings.breakfast = temp.breakfast;
        medicine.timings.lunch = temp.lunch;
        medicine.timings.dinner = temp.dinner;
        medicine.timings.custom = temp.custom.hour + ":" + temp.custom.minute;
        medicine.icon = temp.icon;
        medicine.user = req.user;
    } else {
        medicine.name = req.body.name;
        medicine.endDate = req.body.endDate;
        medicine.note = req.body.notes;
        medicine.days = JSON.parse(req.body.days);
        medicine.timings = {};
        medicine.timings.breakfast = req.body.breakfast;
        medicine.timings.lunch = req.body.lunch;
        medicine.timings.dinner = req.body.dinner;
        medicine.timings.custom = req.body.custom.hour + ":" + req.body.custom.minute;
        medicine.icon = req.body.icon;
        medicine.user = req.user;
    }

    return medicine;
}


function getMedicinesFromObject(req, temp) {
    var medicine = {};
    medicine.name = temp.name;
    medicine.endDate = temp.endDate;
    medicine.note = temp.notes;
    medicine.days = JSON.parse(temp.days);
    medicine.timings = {};
    medicine.timings.breakfast = temp.breakfast;
    medicine.timings.lunch = temp.lunch;
    medicine.timings.dinner = temp.dinner;
    medicine.timings.custom = temp.custom.hour + ":" + temp.custom.minute;
    medicine.icon = temp.icon;
    medicine.user = req.user;
    return medicine;
}

var createMedicine = function (req, res) {
    MedicineOperations.Crud.insertMedicine(getMedicine(req), req.user, function (result) {
        res.json(result);
    });
};

var createMultipleMedicines = function (req, res) {
    var medicines = JSON.parse(req.body.medicines);
    var meds = [];
    medicines.forEach(function (m) {
        meds.push(getMedicinesFromObject(req, m));
    });
    MedicineOperations.Crud.insertMultipleMedicines(meds, function (result) {
        if (result.success) {
            UserOperations.Medicine.linkMedicines(result.data, req.user, function (err, doc) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result.data);
                }
            });
        } else {
            res.json(result);
        }
    });

};

var getAllMedicines = function (req, res) {
    UserOperations.Medicine.getAllMedicines(req.user, function (result) {
        res.json(result);
    });
};

var getMedicine = function (req, res) {
    MedicineOperations.Crud.get(req.params.id, function (result) {
        res.json(result);
    });
};

var finishDosage = function (req, res) {
    MedicineOperations.Crud.finishDosage(req.params.id, function (result) {
        res.json(result);
    });
};

exports.createMedicine = createMedicine;
exports.createMultipleMedicines = createMultipleMedicines;
exports.getAllMedicines = getAllMedicines;
exports.getMedicine = getMedicine;
exports.finishDosage = finishDosage;