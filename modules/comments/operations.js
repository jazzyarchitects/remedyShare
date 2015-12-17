/**
 * Created by Jibin_ism on 01-Dec-15.
 */
'use strict';
var mongoose = require('mongoose');
var Comment = requireFromModule('comments/commentModel');
//var Comment = null;


var getComment = function (comment_id, callback) {
    Comment.findOne({_id: comment_id}, function (err, doc) {
        if (doc) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(err));
        }
    })
};

var insertComment = function (commentDetails, user_id, remedy_id, callback) {
    //var comment=new Comment(commentDetails);
    var comment = new Comment({
        author: user_id,
        remedy: remedy_id,
        comment: commentDetails
    });
    comment.save(function (err) {
        if (err) {
            callback(errorJSON(501, err));
        } else {
            callback(successJSON(comment));
            //callback(errorJSON(501, err));
        }
    });
};

var update = function (commentDetails, callback) {
    if (mongoose.Types.ObjectId.isValid(commentDetails._id)) {
        Comment.update({_id: commentDetails._id}, commentDetails, {upsert: true}, function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, err));
            }
        });
    } else {
        callback(errorJSON(601, "INVALID_DATA_PASSED", "INVALID_COMMENT_ID_FOR_UPDATING"));
    }
};

var del = function (comment_id, callback) {
    Comment.update({_id: comment_id}, {$set: {active: false}}, function (err, doc) {
        if (doc) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.insert = insertComment;
exports.delete = del;
exports.update = update;
exports.getComment = getComment;