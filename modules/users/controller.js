/**
 * Created by Jibin_ism on 26-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var UserOperations = requireFromModule('users/operations');
var ClientOperations = requireFromModule('clients/operations');
var MedicineOperations = requireFromModule('medicine/operations');
var DoctorOperations = requireFromModule('doctors/operations');
var async = require('async');

var signUp = function (user, service, callback) {
    UserOperations.Crud.signUp(user, function (resultUser) {
        //console.log(result);
        if (resultUser.success) {
            ClientOperations.createNewClient(resultUser.data, service, function (result) {
                if (result.error) {
                    callback(errorJSON(501, "ERROR_ASSIGNING_KEY_TO_CLIENT", result.err));
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
        UserOperations.Crud.loginWithEmail(user, function (result) {
            //console.log(result);
            loginCallback(result, service, callback);
        });
    } else if (user.mobile) {
        UserOperations.Crud.loginWithMobile(user, function (result) {
            loginCallback(result, service, callback);
        });
    } else {
        callback(errorJSON(601, "INVALID_DATA_PASSED", "NO_EMAIL_FOR_LOGIN"));
    }
};

var update = function (user, callback) {
    UserOperations.Crud.updateUser(user, function (result) {
        callback(result);
    });
};

var del = function (user, callback) {
    UserOperations.Crud.delete(user, function (result) {
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
    UserOperations.Remedy.getRemedyList(user_id, page, function (result) {
        callback(result);
    });
};

var getUserData = function (user_id, callback) {
    UserOperations.Operations.getUserData(user_id, function (result) {
        callback(result);
    });
};

var logout = function (user, callback) {
    ClientOperations.logout(user, function (result) {
        if (result.success) {
            callback(successJSON({logout: true}));
        }
    });
};

var uploadProfilePicture = function (user, file, callback) {
    UserOperations.Operations.linkProfilePicture(user, file, function (result) {
        callback(result);
    });
};

var loginSocial = function (stream, accessToken, callback) {
    UserOperations.Crud.loginSocial(stream, accessToken, function (resultUser) {
        if (resultUser.success) {
            ClientOperations.createNewClient(resultUser.data, "social", function (result) {
                if (result.error) {
                    callback(errorJSON(501, "ERROR_ASSIGNING_KEY_TO_CLIENT", result.err));
                } else {
                    callback(successJSON({detail: resultUser.data, client: result}));
                }
            });
        } else {
            callback(resultUser);
        }
        //callback(result);
    });
};

var getUserProfile = function (user_id, callback) {
    UserOperations.Operations.getUserProfile(user_id, callback);
};

var uploadAppData = function (req, callback) {
    var data = JSON.parse(req.body.data);

    var importMedicineFunction = function (callback) {
        MedicineOperations.Crud.importFromAppBackup(data.medicines, req.user, function (errs, medicines) {
            callback();
        });
    };

    var importDoctorFunction = function (callback) {
        DoctorOperations.Crud.importFromAppBackup(data.doctors, req.user, function (errs, doctors) {
            callback()
        });
    };

    var linkDoctorsToMedicine = function (callback) {
        MedicineOperations.Doctors.linkDoctorsFromBackup(req.user, function (errs, results) {
            callback();
        });
    };

    var linkMedicinetoDoctors = function (callback) {
        DoctorOperations.Medicines.linkMedicinesFromBackup(req.user, function (errs, results) {
            callback();
        });
    };

    var linkMedicinesToUsers = function (callback) {
        UserOperations.Medicine.linkMedicinesToUserFromAppBackup(req.user, function (errs, results) {
            callback();
        });
    };

    var linkDoctorsToUser = function (callback) {
        UserOperations.Doctor.linkDoctorsToUserFromAppBackup(req.user, function (errs, results) {
            callback();
        });
    };

    async.waterfall([importMedicineFunction,
            importDoctorFunction,
            linkDoctorsToMedicine,
            linkMedicinetoDoctors,
            linkMedicinesToUsers,
            linkDoctorsToUser
        ],
        function (err, result) {
            //console.log("Importing data form backup: \n errors: "+JSON.stringify(err)+" \n Result: "+JSON.stringify(result));
            callback(result);
        })

};


var downloadAppData = function (req, callback) {
    async.parallel([function (callback) {
        MedicineOperations.Backup.exportForApp(req.user, function (result) {
            if (result.success) {
                //console.log("Medicine Operations backup export for App  in user controller: "+JSON.stringify(result));
                callback(null, result.data);
            } else {
                callback(result, null);
            }
        });
    }, function (callback) {
        DoctorOperations.Backup.exportForApp(req.user, function (result) {
            if (result.success) {
                //console.log("Doctor Operations backup export for App  in user controller: "+JSON.stringify(result));
                callback(null, result.data);
            } else {
                callback(result, null);
            }
        });
    }], function (errs, results) {
        var noError = true;
        if (errs && (errs[0] || errs[1])) {
            noError = false;
        }
        if (noError) {
            callback(successJSON({medicines: results[0], doctors: results[1]}));
        } else {
            callback(errorJSON({error1: errs[0], error2: errs[1]}));
        }
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
exports.loginSocial = loginSocial;
exports.getUserProfile = getUserProfile;
exports.uploadAppData = uploadAppData;
exports.downloadAppData = downloadAppData;