/**
 * Created by Jibin_ism on 26-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var UserOperations = requireFromModule('users/operations');
var ClientOperations = requireFromModule('clients/operations');

var signUp = function (user, service, callback) {
    UserOperations.signUp(user, function (resultUser) {
        //console.log(result);
        if (resultUser.success) {
            ClientOperations.createNewClient(resultUser.data, service, function (result) {
                if (result.error) {
                    callback(errorJSON(501, result.err));
                } else {
                    callback(successJSON({detail: resultUser.data, client: result}));
                }
            });
        } else {
            callback(resultUser);
        }
    });
};

function loginCallback(result1, service, callback) {
    if (result1.success) {
        ClientOperations.createNewClient(result1.data, service, function (result) {
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

var login = function (user, service, callback) {
    if (user.email) {
        UserOperations.loginWithEmail(user, function (result) {
            //console.log(result);
            loginCallback(result, service, callback);
        });
    } else if (user.mobile) {
        UserOperations.loginWithMobile(user, function (result) {
            loginCallback(result, service, callback);
        });
    } else {
        callback(errorJSON(601, "INVALID_DATA_PASSED", "NO_EMAIL_FOR_LOGIN"));
    }
};

var update = function (user, callback) {
    UserOperations.updateUser(user, function (result) {
        callback(result);
    });
};

var del = function (user, callback) {
    UserOperations.delete(user, function (result) {
        if (result.success) {
            ClientOperations.logout(user, function (result) {
                if (result.success) {
                    callback(successJSON({deleted: true}));
                } else {
                    callback(result);
                }
            });
        }
    });
};

var remedyList = function (user_id, page, callback) {
    UserOperations.getRemedyList(user_id, page, function (result) {
        callback(result);
    });
};

var getUserData = function (user_id, callback) {
    {
        UserOperations.getUserData(user_id, function (result) {
            callback(result);
        });
    }
};

var logout = function (user, callback) {
    ClientOperations.logout(user, function (result) {
        if (result.success) {
            callback(successJSON({logout: true}));
        }
    });
};

var uploadProfilePicture = function (user, file, callback) {
    UserOperations.linkProfilePicture(user, file, function (result) {
        callback(result);
    });
};

exports.signUp = signUp;
exports.login = login;
exports.update = update;
exports.delete = del;
exports.remedyList = remedyList;
exports.getUserData = getUserData;
exports.logout = logout;
exports.uploadProfilePicture = uploadProfilePicture;