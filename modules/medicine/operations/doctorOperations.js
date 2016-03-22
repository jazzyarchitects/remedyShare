/**
 * Created by jibinmathews on 21/3/16.
 */

var Medicine  = requireFromModule('medicine/MedicineModel');
var Doctor = requireFromModule('doctors/doctorModel');
var async = require('async');

var linkDoctorsFromBackup = function(user_id, callback){
    Medicine.find({user: user_id})
        .exec(function(err, doc){
           if(err){
               callback(errorJSON(601, "mongo error - finding medicines for linking doctors", err));
           } else{
               async.each(doc, function(med, callback){
                   if(med.appDoctorId){
                       Doctor.findOne({user: user_id, appId: med.appDoctorId})
                           .exec(function(err, res){
                               if(err){
                                   callback(err, null);
                               } else{
                                   if(res != null){
                                       Medicine.update({_id: med._id},{
                                           $set:{
                                               doctor: res._id
                                           }
                                       }, function(err, result){
                                           if(err){
                                               callback(err, null);
                                           }else{
                                               callback(null, true);
                                           }
                                       })
                                   }else{
                                       callback(null, true);
                                   }
                               }
                           });
                   }
                   else{
                       callback(null, true);
                   }

               }, function(errs, results){
                    callback(errs, results);
               })
           }
        });
};

exports.linkDoctorsFromBackup = linkDoctorsFromBackup;