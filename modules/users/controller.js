/**
 * Created by Jibin_ism on 26-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var userOperations = requireFromModule('users/operations');
var ClientOperations = requireFromModule('clients/operations');

var signUp = function (user, callback) {
    userOperations.signUp(user, function (result) {
        //console.log(result);
        if (result.success) {
            ClientOperations.createNewClient(result.data, function (result) {
                if (result.error) {
                    callback(errorJSON(501, result.err));
                } else {
                    callback(successJSON({detail: user, client: result}));
                }
            });
        } else {
            callback(result);
        }
    });
};

function loginCallback(result1, callback) {
    if (result1.success) {
        ClientOperations.createNewClient(result1.data, function (result) {
            if (result.error) {
                callback(errorJSON(501, result.err));
            } else {
                callback(successJSON({detail: result1.data, client: result}));
            }
        });
    } else {
        callback(result1);
    }
}

var login = function (user, callback) {
    if (user.email) {
        userOperations.loginWithEmail(user, function (result) {
            //console.log(result);
            loginCallback(result, callback);
        });
    } else if (user.mobile) {
        userOperations.loginWithMobile(user, function (result) {
            loginCallback(result, callback);
        });
    } else {
        callback(errorJSON(601, "INVALID_DATA_PASSED", "NO_EMAIL_FOR_LOGIN"));
    }
};

var update = function (user, callback) {
    userOperations.updateUser(user, function (result) {
        callback(result);
    });
};

var del = function (user, callback) {
    userOperations.delete(user, function (result) {
        if (result.success) {
            ClientOperations.logout(user, function (success) {
                if (success) {
                    callback(result);
                } else {
                    callback(errorJSON(501, success));
                }
            });
        }
    });
    //Delete user from all other links - remedy, likes, shares
};

var remedyList = function (user_id, page, callback) {
    userOperations.getRemedyList(user_id, page, function (result) {
        callback(result);
    });
};

var getUserData = function(user_id, callback){{
   userOperations.getUserData(user_id, function(result){
        callback(result);
   });
}};


exports.signUp = signUp;
exports.login = login;
exports.update = update;
exports.delete = del;
exports.remedyList = remedyList;
exports.getUserData=getUserData;