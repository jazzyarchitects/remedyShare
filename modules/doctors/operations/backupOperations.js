/**
 * Created by jibinmathews on 22/3/16.
 */
var Doctor = requireFromModule('doctors/doctorModel');

var exportForApp = function(user_id, callback){
  Doctor.find({user: user_id})
      .exec(function(err, docs){
         if(err){
             callback(errorJSON(601, "mongo error - exporting doctors for app", err));
         } else{
             var doctors = [];
             docs.forEach(function (doc) {
                 var doctor = {};
                 doctor.id = doc.appId;
                 doctor._id = doc._id;
                 doctor.notes = doc.notes;
                 doctor.hospital = doc.hospital;
                 doctor.address = doc.address;
                 doctor.name = doc.name;
                 if(doc.contacts) {
                     doctor.mobile1 = doc.contacts.phone1;
                     doctor.mobile2 = doc.contacts.phone2;
                 }
                 doctors.push(doctor);
             });
             callback(successJSON(doctors));
         }
      });
};

exports.exportForApp = exportForApp;