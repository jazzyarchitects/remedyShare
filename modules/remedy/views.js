/**
 * Created by Jibin_ism on 27-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var control = requireFromModule('remedy/controller');


function getRemedyObject(req, id) {
    var remedy = {};
    if (id) {
        remedy._id = req.params.id || req.body.id;
    }
    remedy.author = req.user;
    remedy.title = req.body.title;
    remedy.description = req.body.description;
    if (req.body.references) {
        remedy.references = req.body.references;
    }
    return remedy;
}


var insert = function (req, res) {
    control.insert(req.user, getRemedyObject(req), function (result) {
        res.json(result);
    });
};

var getRemedy = function (req, res) {
    control.getRemedy(req.params.id, function (result) {
        res.json(result);
    });
};

var update = function (req, res) {
    control.update(req.user, getRemedyObject(req, true), function (result) {
        res.json(result);
    });
};

var del = function (req, res) {
    control.delete(req.params.id, function (result) {
        res.json(result);
    });
};

var upvote = function (req, res) {
    control.upvote(req.user, req.params.id, function (result) {
        res.json(result);
    });
};

var downvote = function (req, res) {
    control.downvote(req.user, req.params.id, function (result) {
        res.json(result);
    });
};

var insertComment = function (req, res) {
    control.insertComment(req.user, req.params.id, req.body.comment, function (result) {
        res.json(result);
    });
};


exports.insert = insert;
exports.update = update;
exports.delete = del;
exports.upvote = upvote;
exports.downvote = downvote;
exports.insertComment = insertComment;
exports.get = getRemedy;
