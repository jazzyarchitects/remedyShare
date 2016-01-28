/**
 * Created by Jibin_ism on 28-Dec-15.
 */

var Remedy = requireFromModule('remedy/remedyModel');
var mongoose = require('mongoose');
var PAGE_LIMIT = 10;


var insert = function (user, remedy, callback) {
    var remedyObject = new Remedy(remedy);
    remedyObject.save(function (err, doc) {
        if (err) {
            callback({success: false, error: true, err: err});
        } else {
            callback({success: true, remedy: doc});
        }
    });
};


var remove = function (remedy_id) {
    Remedy.remove({_id: remedy_id}, function (err, doc) {
        console.log("removing remedy: " + JSON.stringify(doc));
    });
};

var getRemedy = function (user, remedy_id, callback, dontTrack) {
    if (!dontTrack) {
        Remedy.registerView(remedy_id);
    }
    Remedy.findOne({_id: remedy_id})
        .populate([{
            path: "author",
            select: "name"
        }, {
            path: "comments",
            select: "author comment publishedOn"
            //options: {limit: 10}
        }])
        .exec(function (err, doc) {
            if (doc) {
                doc = doc.toJSON();
                doc.upvoted = false;
                doc.downvoted = false;
                if (user) {
                    if (JSON.stringify(doc.upvote).indexOf(user) != -1) {
                        doc.upvoted = true;
                    }
                    if (JSON.stringify(doc.downvote).indexOf(user) != -1) {
                        doc.downvoted = true;
                    }
                }
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
        if (doc.nModified !== 0) {
            callback(successJSON(remedy));
        } else {
            callback(errorJSON(501, err));
        }
    });
};

var deactivateRemedy = function (remedy_id) {
    Remedy.update({_id: remedy_id}, {$set: {active: false}}, {safe: true}, function (err, doc) {
        //console.log("Deactivating Remedy: " + remedy_id);
    });
};

var getAllRemedies = function (user, page, callback) {
    Remedy.find({active: true}, "_id", function (err, countQueryDoc) {
        if (countQueryDoc) {
            Remedy.find({active: true})
                .select("-comments -rankIndex -__v")
                .populate("author", "name _id")
                .skip((page - 1) * PAGE_LIMIT)
                .limit(PAGE_LIMIT)
                .sort({publishedOn: 1})
                .exec(function (err, doc) {
                    if (doc) {
                        var remedies = [];
                        for (var i = 0; i < doc.length; i++) {
                            remedies.push(doc[i].toJSON());
                            remedies[i].upvoted = false;
                            remedies[i].downvoted = false;
                            remedies[i].bookmarked = false;
                        }
                        if (user) {
                            for (i = 0; i < remedies.length; i++) {
                                //console.log("Remedy #"+i+" "+JSON.stringify(remedies[i]));
                                if (JSON.stringify(remedies[i].upvote).indexOf(user) != -1) {
                                    remedies[i].upvoted = true;
                                }
                                if (JSON.stringify(remedies[i].downvote).indexOf(user) != -1) {
                                    remedies[i].downvoted = true;
                                }
                                if (JSON.stringify(remedies[i].bookmarked_by).indexOf(user) != -1) {
                                    remedies[i].bookmarked = true;
                                }
                            }
                        }
                        for (i = 0; i < doc.length; i++) {
                            delete remedies[i].upvote;
                            delete remedies[i].downvote;
                            delete remedies[i].bookmarked_by;
                        }
                        callback(successJSON({
                            remedies: remedies,
                            page: Number(page),
                            totalCount: countQueryDoc.length,
                            pageLimit: PAGE_LIMIT
                        }));
                    } else {
                        callback(errorJSON(501, "GENERAL_ERROR", err));
                    }
                });
        } else {
            callback(errorJSON(501, "GENERAL_ERROR", err));
        }
    });

};


exports.Insert = insert;
exports.Update = update;
exports.RemoveRemedy = remove;
exports.GetRemedy = getRemedy;
exports.DeactivateRemedy = deactivateRemedy;
exports.GetAllRemedies = getAllRemedies;




