/**
 * Created by Jibin_ism on 26-Nov-15.
 */

'use strict';

var mongoose = require('mongoose');
var User = requireFromModule('users/userModel');
var Hash=requireFromModule('clients/cryptoOperations');

/**
 * User SignUp Function
 * @param userDetails - json object containing all the fields
 * @param callback - callback function
 */
var signUp = function (userDetails, callback) {
    User.findOne({$or :[{email: userDetails.email},{mobile:userDetails.mobile}]},function(err, doc){
       if(doc){
           callback(errorJSON(601, "INVALID_DATA_PASSED" , "EMAIL_OR_MOBILE_REGISTERED"));
       } else {
           var user=new User(userDetails);
           Hash.hash(user, user.created_at.toString(),function(result){
               if(result.success){
                   user.password=result.hash;
                   user.save(function(err){
                       if (err) {
                           callback(errorJSON(501, err));
                       } else {
                           callback(successJSON(user))
                       }
                   });
               }else{
                   callback(errorJSON(501, result.error));
               }
           });
       }
    });
};

var loginWithEmail = function (user, callback) {
    console.log("Login With Email...");
    User.findOne({email: user.email},function(err,userDoc){
       if(userDoc){
           Hash.hash(user, userDoc.created_at.toString(), function(result){
               if(result.success){
                   if(userDoc.password == result.hash){
                       callback(successJSON(userDoc));
                   }else{
                       callback(errorJSON(602, "AUTHENTICATION_ERROR"));
                   }
               }else{
                   callback(errorJSON(501, result.error))
               }
           });
           //TODO: Compare password and then execute the clientOperation
       } else{
           callback(errorJSON(601,"INVALID_DATA_PASSED", "USER_NOT_REGISTERED"));
       }
    });
};

var loginWithMobile = function (user, callback) {
    console.log("Login with mobile...");
    User.findOne({mobile: user.mobile},function(err, doc){
        if(doc){
            //LOcal login
        }else{
            callback(errorJSON(601,"INVALID_DATA_PASSED", "USER_NOT_REGISTERED"));
        }
    });
};

var update = function (user, callback) {
    if (user._id) {
        User.update({_id: user._id}, user, function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, err));
            }
        });
    } else {
        callback(errorJSON(602, "AUTHENTICATION_ERROR", "USER_NOT_LOGGED_IN"));
    }
};

var del=function(user, callback){
    User.remove({_id:user._id},function(err, doc){
       if(doc){
           callback(successJSON(doc));
       } else{
           callback(errorJSON(501, err));
       }
    });
};


exports.signUp = signUp;
exports.loginWithEmail = loginWithEmail;
exports.loginWithMobile = loginWithMobile;
exports.updateUser = update;
exports.delete=del;