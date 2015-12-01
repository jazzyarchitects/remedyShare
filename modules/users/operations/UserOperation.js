/**
 * Created by Jibin_ism on 26-Nov-15.
 */

'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userExists = function (condition) {
    console.log('Checking user existence');
    User.findOne(condition, function (err, doc) {
        if (doc) {
            return true;
        } else {
            return false;
        }
    });
};

var emailRegistered = function (user) {
    return userExists({email: user.email});
};

var mobileRegistered = function (user) {
    return userExists({mobile: user.mobile});
};


var signUp = function (userDetails, callback) {
    console.log('Signing up user: ' + userDetails.name);
    if (!emailRegistered(userDetails) && !mobileRegistered(userDetails)) {
        User.save(userDetails, function (err, doc) {
            if (!doc) {
                callback(errorJSON(500, err));
            } else {
                callback(successJSON(doc))
            }
        });
        //var user=new User(userDetails);
        //user.save(function(err){
        //   if(err){
        //        callback(errorJSON(500, err));
        //   }else{
        //       callback(successJSON())
        //   }
        //});
    } else {
        callback(errorJSON(501, "EMAIL_OR_MOBILE_REGISTERED"));
    }
};

var loginWithEmail = function (user, callback) {
    console.log("Login With Email...");
    if (emailRegistered(user)) {
        //Login Logic
    } else {
        callback(errorJSON(501, "USER_NOT_REGISTERED"));
    }
};

var loginWithMobile = function (user, callback) {
    console.log("Login with mobile...");
    if (mobileRegistered(user)) {
        //Login Logic
    } else {
        callback(errorJSON(501, "USER_NOT_REGISTERED"));
    }
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
        callback(errorJSON(501, "USER_NOT_LOGGED_IN"));
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
