/**
 * Created by Jibin_ism on 28-Dec-15.
 */

var Remedy = requireFromModule('remedy/remedyModel');

var upvote = function (user_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        upvote: user_id
    }, {
        $inc: {"stats.upvote": -1},
        $pull: {upvote: user_id}
    }, function (err, doc) {
        if (doc.nModified === 1) {
            //console.log("Removed upvote");
        } else {
            Remedy.update({
                _id: remedy_id,
                upvote: {$ne: user_id}
            }, {
                $inc: {"stats.upvote": 1},
                $push: {upvote: user_id}
            }, function (err, doc) {
                if (doc.nModified === 1) {
                    Remedy.updateRankingIndex(remedy_id, 1);
                    Remedy.update({
                        _id: remedy_id,
                        downvote: user_id
                    }, {
                        $inc: {"stats.downvote": -1},
                        $pull: {downvote: user_id}
                    }, function (err, doc) {
                        //console.log("Updating upvote in remedy: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                    });
                } else {
                    //console.log("Updating upvote in remedy (else): " + JSON.stringify(err) + " " + JSON.stringify(doc))
                }
            });
        }
    });

};

var downvote = function (user_id, remedy_id, callback) {
    Remedy.update({
        _id: remedy_id,
        downvote: user_id
    }, {
        $inc: {"stats.downvote": -1},
        $pull: {downvote: user_id}
    }, function (err, doc) {
        if (doc.nModified === 1) {
            //console.log("Downvote: Removed downvote from downvoted");
        } else {
            Remedy.update({
                _id: remedy_id,
                downvote: {$ne: user_id}
            }, {
                $inc: {"stats.downvote": 1},
                $push: {downvote: user_id}
            }, function (err, doc) {
                if (doc.nModified === 1) {
                    Remedy.updateRankingIndex(remedy_id, -1);
                    Remedy.update({
                        _id: remedy_id,
                        upvote: user_id
                    }, {
                        $inc: {"stats.upvote": -1},
                        $pull: {upvote: user_id}
                    }, function (err, doc) {
                        //console.log("Updating downvote in remedy: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                    });
                } else {
                    //console.log("Updating downvote in remedy (else): " + JSON.stringify(err) + " " + JSON.stringify(doc))
                }
            });
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


var registerView = function (_id) {
    Remedy.registerView(_id);
};

function __find(remedy_id, populateOptions, callback) {
    Remedy.findOne({_id: remedy_id, active: true})
        .populate(populateOptions)
        .exec(function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, "GENERAL_ERROR", err));
            }
        });
}

function getVotes(remedy_id, path, callback) {
    __find(remedy_id, {
        path: path,
        match: {active: true},
        select: "name"
    }, callback);
}

var getUpvotes = function (remedy_id, callback) {
    getVotes(remedy_id, "upvote", callback);
};

var getDownVotes = function (remedy_id, callback) {
    getVotes(remedy_id, "downvote", callback);
};

var getCommentList = function (remedy_id, callback) {
    __find(remedy_id, {
        path: "comments",
        match: {active: true},
        select: "_id author"
    }, callback);
};


exports.GetUpVotes = getUpvotes;
exports.GetDownVotes = getDownVotes;
exports.Upvote = upvote;
exports.Downvote = downvote;
exports.InsertComment = insertComment;
exports.DeleteComment = deleteComment;
exports.RegisterView = registerView;
exports.GetCommentList = getCommentList;