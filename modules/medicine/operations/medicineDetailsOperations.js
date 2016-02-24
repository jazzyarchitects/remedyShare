/**
 * Created by Jibin_ism on 08-Feb-16.
 */
var mongoose = require('mongoose');
var MedicineDetails = requireFromModule('medicine/MedicineDetails');

var insertDetails = function(medicineId, medicineDetails, callback){

};

var getDetails = function(detailsId, callback){
    MedicineDetails.findOne({_id: detailsId}, function(err, doc){
        if(err){
            callback(errorJSON(601, "UNABLE TO FIND MEDICINE DETAILS", err));
        } else{
            callback(successJSON(doc));
        }
    });
};



exports.insertDetails = insertDetails;
exports.getDetails = getDetails;