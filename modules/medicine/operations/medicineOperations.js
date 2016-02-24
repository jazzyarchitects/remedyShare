/**
 * Created by Jibin_ism on 06-Feb-16.
 */

var mongoose = require('mongoose');
var Medicine = requireFromModule('medicine/Medicine');

var insertMedicine = function (medicine, user, callback) {
    var medicine2 = new Medicine(medicine);
    medicine2.save(function(err, doc){
       if(err){
           callback(errorJSON(601, "Unable to save Medicine", err));
       } else{
           callback(successJSON(medicine2));
       }
    });
};

exports.insertMedicine = insertMedicine;