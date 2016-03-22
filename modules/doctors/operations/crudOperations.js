/**
 * Created by jibinmathews on 21/3/16.
 */
var Doctor = requireFromModule('doctors/doctorModel');
var async = require('async');

var insert = function(doctor, callback){
  var doctorObject = new Doctor(doctor);
    doctorObject.save(function(err, doc){
       if(err){
           callback(errorJSON(601, "Mongo error - saving doctor", err));
       } else{
           callback(successJSON(doctorObject));
       }
    });
};


function getDoctorObject(obj, user_id){
    var doctor ={};
    doctor.appId = obj.id;
    doctor.contacts ={};
    doctor.name = obj.name;
    doctor.address = obj.address;
    doctor.contacts.phone1 = obj.mobile1;
    doctor.contacts.phone2 = obj.mobile2;
    doctor.notes = obj.notes;
    doctor.hospital = obj.hospital;
    doctor.user = user_id;

    return doctor;
}

//{
//    "id": "219514372",
//    "mobile1": "9979",
//    "notes": "gghh",
//    "address": "some address",
//    "mobile2": "797967",
//    "hospital": "bzbbs",
//    "name": "doctor 1"
//}

var importFromAppBackup = function(docs, user_id, callback){
    Doctor.remove({user: user_id}, function(err, doc){
        async.each(docs, function(doc, callback){
            var doctor = new Doctor(getDoctorObject(doc, user_id));
            doctor.save(function(err, result){
                if(err){
                    callback(err, null);
                } else{
                    //console.log("Saving doctor: "+JSON.stringify(err)+"\n"+JSON.stringify(doctor));
                    callback(null, doctor);
                }
            });
        }, function(errs, doctors){
            //console.log("Doctors/crudOperations/importFromAppBackup: \nerr: "+JSON.stringify(errs)+"\nResults: "+JSON.stringify(doctors));
            callback(errs, doctors);
        });
    });

};

exports.insert = insert;
exports.importFromAppBackup = importFromAppBackup;