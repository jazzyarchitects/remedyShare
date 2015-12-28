/**
 * Created by Jibin_ism on 26-Nov-15.
 */

'use strict';

var mongoose = require('mongoose');
var User = requireFromModule('users/userModel');
var Hash = requireFromModule('clients/cryptoOperations');
var PAGE_LIMIT = 5;

/**
 * User SignUp Function
 * @param userDetails - json object containing all the fields
 * @param callback - callback function
 */
var signUp = function (userDetails, callback) {
    User.findOne({$or: [{email: userDetails.email}, {mobile: userDetails.mobile}]}, function (err, doc) {
        if (doc) {
            callback(errorJSON(601, "INVALID_DATA_PASSED", "EMAIL_OR_MOBILE_REGISTERED"));
        } else {
            var user = new User(userDetails);
            Hash.hash(user, user.created_at.toString(), function (result) {
                if (result.success) {
                    user.password = result.hash;

                    user.save(function (err) {
                        if (err) {
                            callback(errorJSON(501, err));
                        } else {
                            callback(successJSON(user))
                        }
                    });
                } else {
                    callback(errorJSON(501, result.error));
                }
            });
        }
    });
};

function __login(query, user, callback) {
    User.findOne(query, function (err, userDoc) {
        if (userDoc) {
            Hash.hash(user, userDoc.created_at.toString(), function (result) {
                if (result.success) {
                    if (userDoc.password == result.hash) {
                        callback(successJSON(userDoc));
                    } else {
                        callback(errorJSON(602, "AUTHENTICATION_ERROR"));
                    }
                } else {
                    callback(errorJSON(501, result.error))
                }
            });
        } else {
            callback(errorJSON(601, "INVALID_DATA_PASSED", "USER_NOT_REGISTERED"));
        }
    });
}

var loginWithEmail = function (user, callback) {
    //console.log("Login With Email...");
    __login({email: user.email}, user, callback)

};


var loginWithMobile = function (user, callback) {
    console.log("Login with mobile...");
    __login({mobile: user.mobile}, user, callback);
};

var update = function (user, callback) {
    delete user.password;
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

var del = function (user, callback) {
    User.remove({_id: user._id}, function (err, doc) {
        if (doc) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(501, err));
        }
    });
};


//Model.update({condition},{$set:{name: name, age: age...}}, callback);
var insertRemedy = function (user_id, remedy, callback) {
    //TODO: insert remedy to user
    //console.log("Debug: "+JSON.stringify({_id: user_id})+" for remedy: "+remedy._id);
    User.update({
            _id: user_id            //Match Parameter
        },
        {
            $push: {remedies: remedy._id},
            $inc: {'stats.remedies': 1}
        },
        {
            safe: true,
            upsert: true
        }, function (err, doc) {
            //console.log("Linking Remedy: " + JSON.stringify(doc) + " Error: " + JSON.stringify(err));
            if (doc.nModified === 1) {
                callback(true);
            } else {
                callback(false);
            }
        });

};

var remedyList = function (user_id, page, callback) {
    page = page || 1;
    User.findOne({_id: user_id})
        .populate({
            path: "remedies",
            match: {active: true},
            select: 'title publishedOn stats image diseases',
            options: {limit: PAGE_LIMIT, skip: (page - 1) * PAGE_LIMIT},
            sort: {publishedOn: 1}
        })
        .select("_id remedies")
        .exec(function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, err));
            }
        });
};

var unlinkRemedy = function (user, remedy, callback) {
    User.update({
        _id: user,
        "remedyVotes.upvote": remedy
    }, {
        $inc: {"stats.remedyVotes.upvote": -1},
        $pull: {"remedyVotes.upvote": remedy}
    }, function (err, doc) {
        console.log("Update upvote: " + JSON.stringify(err) + " " + JSON.stringify(doc));
    });
    User.update({
        _id: user,
        "remedyVotes.downvote": remedy
    }, {
        $inc: {"stats.remedyVotes.downvote": -1},
        $pull: {"remedyVotes.downvote": remedy}
    }, function (err, doc) {
        console.log("Update downvote: " + JSON.stringify(err) + " " + JSON.stringify(doc));
    });
    User.update({
            _id: user,
            "stats.remedies": {$gte: 1},
            remedies: remedy,
            "deleted.remedies": {$ne: [remedy]}
        }, {
            $inc: {"stats.remedies": -1, "stats.deleted.remedies": 1},
            $push: {'deleted.remedies': remedy},
            $pull: {remedies: remedy}
        },
        {
            safe: true
        },
        function (err, doc) {
            console.log("Unlinking Remedy from user: " + JSON.stringify(doc) + " " + JSON.stringify(err));
            if (doc) {
                callback(true)
            } else {
                callback(false);
            }
        }
    )
};

var getUserData = function (user_id, callback) {
    User.find({_id: user_id}, function (err, doc) {
        if (doc) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(err));
        }
    });
};

var upvoteRemedy = function (user_id, remedy_id, callback) {
    remedy_id = mongoose.Types.ObjectId(remedy_id);
    User.update({
        _id: user_id,
        "remedyVotes.upvote": {$ne: remedy_id}
    }, {
        $inc: {"stats.remedyVotes.upvote": 1},
        $push: {'remedyVotes.upvote': remedy_id}
    }, function (err, doc) {
        if (doc.ok === 1) {
            User.update({_id: user_id, "remedyVotes.downvote": remedy_id}, {
                $inc: {"stats.remedyVotes.downvote": -1},
                $pull: {"remedyVotes.downvote": remedy_id}
            }, function (err, doc) {
                console.log("Updating upvote in user: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                //callback(true);
            });
        } else {
            console.log("Updating upvote in user (else):" + JSON.stringify(err) + " " + JSON.stringify(doc));
            //callback(true);
        }
    });
};

var downvoteRemedy = function (user_id, remedy_id, callback) {
    remedy_id = mongoose.Types.ObjectId(remedy_id);
    User.update({
        _id: user_id,
        "remedyVotes.downvote": {$ne: remedy_id}
    }, {
        $inc: {"stats.remedyVotes.downvote": 1},
        $push: {"remedyVotes.downvote": remedy_id}
    }, function (err, doc) {
        if (doc.nModified === 1) {
            User.update({_id: user_id, "remedyVotes.upvote": remedy_id}, {
                $inc: {"stats.remedyVotes.upvote": -1},
                $pull: {"remedyVotes.upvote": remedy_id}
            }, function (err, doc) {
                console.log("Updating downvote in user: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                //callback(true);
            });
        } else {
            console.log("Updating downvote in user (else):" + JSON.stringify(err) + " " + JSON.stringify(doc));
            //callback(true);
        }
    });
};

var addComment = function (user_id, comment_id, callback) {
    User.update({
        _id: user_id,
        comments: {$ne: comment_id}
    }, {
        $inc: {"stats.comments": 1},
        $push: {comments: comment_id}
    }, function (err, doc) {
        if (doc) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(err));
        }
    });
};

var deleteComment = function (user_id, comment_id, callback) {
    User.update({
        _id: user_id,
        comments: comment_id
    }, {
        $inc: {"stats.comments": -1, "stats.deleted.comments": 1},
        $pull: {comments: comment_id},
        $push: {"deleted.comments": comment_id}
    }, function (err, doc) {
        if (doc) {
            callback(true);
        } else {
            callback(false);
        }
    })
};

var linkProfilePicture = function (user, file, callback) {
    User.update({
        _id: user
    }, {
        $set: {
            "image.filename": file.filename,
            "image.path": file.path
        }
    }, {
        safe: true,
        upsert: false
    }, function (err, doc) {
        if (doc) {
            User.findOne({_id: user}).select("_id email image").exec(function (err, doc) {
                if (doc) {
                    callback(successJSON(doc));
                } else {
                    callback(errorJSON(501, "GENERAL_ERROR", err));
                }
            });
        } else {
            callback(errorJSON(501, "GENERAL_ERROR", err));
        }
    });
};

var exportForBackup = function (callback) {
    User.find({},"+password", function (err, doc) {
        if (err) {
            console.log("Error exporting users: " + JSON.stringify(err));
            callback(errorJSON(501, "GENERAL_ERROR_-_MONGOOSE_ERROR", err));
        } else {
            callback(successJSON(doc));
        }
    });
};


var importBackup = function(users, callback){
    User.create(users, function(err, doc){
        if(err){
            console.log("Erorr importing users: "+JSON.stringify(err));
            callback(errorJSON(501,"ERROR_IMPORTING_USER_BACKUP", err));
        } else{
            callback({success: true});
        }
    });
};

exports.signUp = signUp;
exports.loginWithEmail = loginWithEmail;
exports.loginWithMobile = loginWithMobile;
exports.updateUser = update;
exports.delete = del;
exports.linkRemedy = insertRemedy;
exports.getRemedyList = remedyList;
exports.unlinkRemedy = unlinkRemedy;
exports.getUserData = getUserData;
exports.upvoteRemedy = upvoteRemedy;
exports.downvoteRemedy = downvoteRemedy;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.linkProfilePicture = linkProfilePicture;
exports.exportForBackup = exportForBackup;
exports.importBackup = importBackup;