/**
 * Created by jibinmathews on 22/3/16.
 */
var Medicine = requireFromModule('medicine/MedicineModel');

var exportForApp = function (user_id, callback) {
    Medicine.find({user: user_id, active: true})
        .exec(function (err, docs) {
            if (err) {
                callback(errorJSON(601, "Mongo error - exporting medicines for app", err));
            } else {
                var medicines = [];
                docs.forEach(function (med) {
                    var medicine = {};
                    if (med.timings) {
                        medicine.dinner = med.timings.dinner;
                        medicine.breakfast = med.timings.breakfast;
                        medicine.lunch = med.timings.lunch;

                        if (med.timings.custom) {
                            var custom = med.timings.custom.split(":");
                            medicine.customTime = {};
                            medicine.customTime.hour = Number(custom[0]);
                            medicine.customTime.minutes = Number(custom[1]);
                        }

                        medicine.days = med.days;
                        medicine.id = med.appId;
                        medicine.icon = med.icon;
                        medicine.name = med.name;
                        medicine.endDate = med.endDate;
                        medicine.notes = med.notes;
                        medicine.doctor = med.appDoctorId;

                        medicines.push(medicine);
                    }

                });
                callback(successJSON(medicines));
            }
        });
};


exports.exportForApp = exportForApp;