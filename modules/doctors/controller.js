/**
 * Created by jibinmathews on 21/3/16.
 */
var DoctorOperations = requireFromModule('doctors/operations');
var UserOperations = requireFromModule('users/operations');

function getDoctorObject(req){
 var doctor = {};
    doctor.name = req.body.name;
    doctor.contacts = {};
    doctor.contacts.phone1  = req.body.mobile1;
    doctor.contacts.phone2 = req.body.mobile2;
    doctor.address = req.body.address;
    doctor.hospital = req.body.hospital;
    doctor.appId = req.body.id;
    doctor.user = req.user;
    doctor.notes = req.body.notes;
    return doctor;
}

var insert = function(req, res){
    DoctorOperations.Crud.insert(getDoctorObject(req), function(result){
        res.json(result);
    });
};

exports.insert = insert;