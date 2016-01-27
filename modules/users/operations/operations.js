/**
 * Created by Jibin_ism on 26-Nov-15.
 */

'use strict';

var mongoose = require('mongoose');
var User = requireFromModule('users/userModel');
var PAGE_LIMIT = 5;




var getUserData = function (user_id, callback) {
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        user_id=mongoose.Types.ObjectId(user_id);
    }
    User.findOne({_id: user_id}, function (err, doc) {
        //console.log("UserOperations: "+JSON.stringify(doc)+ " \nfor user:"+user_id);
        if (doc) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(err));
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



exports.getUserData = getUserData;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.linkProfilePicture = linkProfilePicture;