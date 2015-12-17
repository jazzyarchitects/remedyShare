/**
 * Created by Jibin_ism on 17-Dec-15.
 */

var RemedyOperations = requireFromModule('remedy/operations');
var UserOperations = requireFromModule('users/operations');
var CommentOperations = requireFromModule('comments/operations');
var mongoose = require('mongoose');

var deleteComment = function (user_id, comment_id, callback) {
    user_id = mongoose.Types.ObjectId(user_id);
    comment_id = mongoose.Types.ObjectId(comment_id);
    CommentOperations.getComment(comment_id, function (result) {
        if (result.success) {
            var comment = result.data;
            if (comment.author.equals(user_id)) {
                CommentOperations.delete(comment_id, function (result) {
                    if (result) {
                        RemedyOperations.deleteComment(comment_id, comment.remedy, function (result) {
                            if (result) {
                                UserOperations.deleteComment(user_id, comment_id, function (result) {
                                    if (result) {
                                        callback(successJSON({deletedComment: true}));
                                    } else {
                                        callback(errorJSON(501, "GENERAL_ERROR", "ERROR_DELETING_COMMENT_FROM_USER"));
                                    }
                                })
                            } else {
                                callback(errorJSON(501, "GENERAL_ERROR", "ERROR_DELETING_COMMENT_FROM_REMEDY"));
                            }
                        })
                    }
                });
            } else {
                callback(errorJSON(603, "NOT_ALLOWED", "USER_NOT_THE_AUTHOR"));
            }
        } else {
            callback(result);
        }
    });

};


exports.deleteComment = deleteComment;