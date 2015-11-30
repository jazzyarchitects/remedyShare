/**
 * Created by Jibin_ism on 26-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var userOperations=requireFromModule('users/operations/UserOperation');

var signup = function (user, callback) {
    userOperations.signUp(user, function(result){
        console.log(result);
        callback(result);
    });
};

var login=function(user, callback){
    if(user.email){
        userOperations.loginWithEmail(user, function(result){
           callback(result)
        });
    }else if(user.mobile){
        userOperations.loginWithMobile(user, function(result){
           callback(result);
        });
    }else{
        callback(errorJSON(501,"INVALID_PARAMETERS_PASSED"));
    }

};

var update=function(user, callback){
    userOperations.update(user, function(result){
       callback(result);
    });
};

exports.signUp=signup;
exports.login=login;
exports.update=update;