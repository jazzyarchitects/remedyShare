/**
 * Created by Jibin_ism on 06-Feb-16.
 */

var MedicineOperations = requireFromModule('medicine/operations');
var UserOperations = requireFromModule('users/operations');


function getMedicine(req){

    var medicine = {};
    medicine.name=req.body.name;
    medicine.days=req.body.medDays;
    medicine.doctor = req.body.doctor;
    medicine.endDate = req.body.endDate;

    return medicine;
}

var createMedicine = function(req, res){
    MedicineOperations.insertMedicine(getMedicine(req), req.user, function(result){
       res.json(result);
    });
};

exports.createMedicine = createMedicine;
