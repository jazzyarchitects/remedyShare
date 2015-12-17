/**
 * Created by Jibin_ism on 26-Nov-15.
 */

'use strict';

var mongoose = require('mongoose');
var Remedy = requireFromModule('remedy/remedyModel');
var PAGE_LIMIT = 10;

var insert = function (user, remedy, callback) {
    var remedyObject = new Remedy(remedy);
    remedyObject.save(function (err) {
        if (err) {
            callback({success: false, error: true, err: err});
        } else {
            callback({success: true, remedy: remedyObject});
        }
    });
};

function getVotes(remedy_id, path, callback) {
    Remedy.findOne({_id: remedy_id})
        .populate({
            path: path,
            match: {active: true},
            select: "name"
        })
        .exec(function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, err));
            }
        });
}

var getUpvotes = function (remedy_id, callback) {
    getVotes(remedy_id, "upvote", callback);
};

var getDownVotes = function (remedy_id, callback) {
    getVotes(remedy_id, "downvote", callback);
};

var remove = function (remedy_id) {
    Remedy.remove({_id: remedy_id}, function (err, doc) {
        console.log("removing remedy: " + JSON.stringify(doc));
    });
};

var getRemedy = function (remedy_id, callback) {
    Remedy.findOne({_id: remedy_id})
        .populate([{
            path: "author",
            select: "name"
        }, {
            path: "comments",
            select: "author comment publishedOn",
            options: {limit: 10}
        }])
        .exec(function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, err));
            }
        });
};

var update = function (remedy, callback) {
    Remedy.update({_id: remedy._id}, {
        $set: {
            title: remedy.title,
            description: remedy.description,
            references: remedy.references
        }
    }, {safe: true, upsert: true}, function (err, doc) {
        //console.log("Hello: " + JSON.stringify(doc) + " " + JSON.stringify(err));
        if (doc.nModified !== 0) {
            callback(successJSON(remedy));
        } else {
            callback(errorJSON(501, err));
        }
    });
};

var deactivateRemedy = function (remedy_id) {
    Remedy.update({_id: remedy_id}, {$set: {active: false}}, {safe: true}, function (err, doc) {
        console.log("Deactivating Remedy: " + remedy_id);
    });
};

var upvote = function (user_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        upvote: {$ne: user_id}
    }, {
        $inc: {"stats.upvote": 1},
        $push: {upvote: user_id}
    }, function (err, doc) {
        if (doc.nModified === 1) {
            Remedy.update({
                _id: remedy_id,
                downvote: user_id
            }, {
                $inc: {"stats.downvote": -1},
                $pull: {downvote: user_id}
            }, function (err, doc) {
                console.log("Updating upvote in remedy: " + JSON.stringify(err) + " " + JSON.stringify(doc));
            });
        } else {
            console.log("Updating upvote in remedy (else): " + JSON.stringify(err) + " " + JSON.stringify(doc))
        }
    });
};

var downvote = function (user_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        dowbvote: {$ne: user_id}
    }, {
        $inc: {"stats.downvote": 1},
        $push: {downvote: user_id}
    }, function (err, doc) {
        if (doc.nModified === 1) {
            Remedy.update({
                _id: remedy_id,
                upvote: user_id
            }, {
                $inc: {"stats.upvote": -1},
                $pull: {upvote: user_id}
            }, function (err, doc) {
                console.log("Updating downvote in remedy: " + JSON.stringify(err) + " " + JSON.stringify(doc));
            });
        } else {
            console.log("Updating downvote in remedy (else): " + JSON.stringify(err) + " " + JSON.stringify(doc))
        }
    });
};

var insertComment = function (comment_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        comments: {$ne: comment_id}
    }, {
        $inc: {'stats.comments': 1},
        $push: {comments: comment_id}
    }, function (err, doc) {
        if (doc.nModified !== 0) {
            callback(successJSON(doc));
        } else {
            callback(errorJSON(err));
        }
    });
};

var deleteComment = function (comment_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        comments: comment_id
    }, {
        $inc: {'stats.comments': -1},
        $pull: {comments: comment_id},
        $push: {deletedComments: comment_id}
    }, function (err, doc) {
        if (doc.nModified !== 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.insert = insert;
exports.removeRemedy = remove;
exports.getUpVotes = getUpvotes;
exports.getDownVotes = getDownVotes;
exports.getRemedy = getRemedy;
exports.update = update;
exports.deactivateRemedy = deactivateRemedy;
exports.upvote = upvote;
exports.downvote = downvote;
exports.insertComment = insertComment;
exports.deleteComment= deleteComment;