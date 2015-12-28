/**
 * Created by Jibin_ism on 28-Dec-15.
 */

var Remedy = requireFromModule('remedy/remedyModel');
var PAGE_LIMIT=10;

var search = function (searchWord, page, callback) {
    var options = {};
    if (page === 1) {
        options = {limit: PAGE_LIMIT};
    } else {
        options = {
            limit: PAGE_LIMIT,
            skip: (page - 1) * PAGE_LIMIT
        }
    }
    options.sort = {score: {$meta: 'textScore'}};
    Remedy.find({
        '$text': {
            '$search': searchWord
        },
        active: true
    }).limit(PAGE_LIMIT)
        .skip((page - 1) * PAGE_LIMIT)
        .sort({score: {$meta: 'textScore'}})
        .populate("author", "_id name")
        .exec(function (err, doc) {
            if (doc) {
                callback(successJSON(doc));
            } else {
                callback(errorJSON(501, "GENERAL_ERROR_-_SEARCHING", err));
            }
        });

};


var findRemedyByDisease = function (disease, page, callback) {
    disease = disease.split(',');
    for (var i = 0; i < disease.length; i++) {
        disease[i] = disease[i].toLowerCase();
    }
    var options = {};
    if (page === 1) {
        options = {limit: PAGE_LIMIT};
    } else {
        options = {
            limit: PAGE_LIMIT,
            skip: (page - 1) * PAGE_LIMIT
        }
    }
    Remedy.find({diseases: {$in: disease}, active: true}, function (err, doc1) {
        if (doc1) {
            Remedy.find({diseases: {$in: disease}}, "author title description stats", {
                options: options
            }, function (err, doc) {
                if (doc) {
                    callback(successJSON({remedies: doc, count: doc1.length, page: page}));
                } else {
                    callback(errorJSON(501, "GENERAL_ERROR", err));
                }
            })
        } else {
            callback(successJSON(501, "GENERAL_ERROR", err));
        }
    });
};

exports.Search = search;
exports.FindByDisease = findRemedyByDisease;