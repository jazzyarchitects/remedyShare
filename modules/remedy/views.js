/**
 * Created by Jibin_ism on 27-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var control = requireFromModule('remedy/controller');
var fs = require('fs');


function getRemedyObject(req, id) {
    var remedy = {};
    var i;
    if (id) {
        remedy._id = req.params.id || req.body.id;
    }
    remedy.author = req.user;
    remedy.title = req.body.title;
    remedy.description = req.body.description;
    remedy.image = {};
    if (req.file) {
        remedy.image.filename = req.file.filename;
        remedy.image.path = JSON.stringify(req.file.path);
    }
    if (req.body.tags) {
        remedy.tags = req.body.tags.split(",");
        for (i = 0; i < remedy.tags.length; i++) {
            remedy.tags[i] = remedy.tags[i].trim();
        }
    }
    if (req.body.diseases) {
        remedy.diseases = req.body.diseases.split(",");
        for (i = 0; i < remedy.diseases.length; i++) {
            remedy.diseases[i] = remedy.diseases[i].trim();
        }
    }
    if (req.body.references) {
        remedy.references = req.body.references.split(",");
        for (i = 0; i < remedy.references.length; i++) {
            remedy.references[i] = remedy.references[i].trim();
        }
    }
    return remedy;
}


var insert = function (req, res) {
    //var remedy = getRemedyObject(req);
    //console.log("Remedy: "+JSON.stringify(remedy)+" \nFiles: "+JSON.stringify(req.file));
    control.insert(req.user, getRemedyObject(req), function (result) {
        res.json(result);
    });
};

var getRemedy = function (req, res) {
    control.getRemedy(req.user, req.params.id, function (result) {
        res.json(result);
    });
};

var update = function (req, res) {
    control.update(req.user, getRemedyObject(req, true), function (result) {
        res.json(result);
    });
};

var del = function (req, res) {
    control.delete(req.user, req.params.id, function (result) {
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

var findRemedyByDisease = function (req, res) {
    var page = req.params.page || 1;
    var queryDisease = decodeURIComponent(req.params.disease);
    control.findRemedyByDisease(queryDisease, page, function (result) {
        res.json(result);
    });
};

var searchRemedy = function (req, res) {
    control.searchRemedy(decodeURIComponent(req.params.query), req.params.page || 1, function (result) {
        res.json(result);
    });
};

var getAllRemedies = function (req, res) {
    control.getAllRemedies(req.user, req.params.page || 1, function (result) {
        res.json(result);
    });
};

var registerView = function (req, res) {
    control.registerView(req.params.id);
    res.end();
};

var importFromJSON = function (req, res) {
    control.importFromJSON(req.user, req.file, function (result) {
        res.json(result);
    });
};

var getCommentList = function (req, res) {
    control.getCommentList(req.params.id, function (result) {
        res.json(result);
    })
    ;
};

var bookmarkRemedy = function(req, res){
  control.bookmarkRemedy(req.user, req.params.id, function(result){
      if(result){
          res.json(successJSON({upvoted: true}));
      }else{
          res.json(errorJSON({upvoted: false}));
      }
  });
};

exports.insert = insert;
exports.update = update;
exports.delete = del;
exports.upvote = upvote;
exports.downvote = downvote;
exports.insertComment = insertComment;
exports.get = getRemedy;
exports.findByDisease = findRemedyByDisease;
exports.searchRemedy = searchRemedy;
exports.getAll = getAllRemedies;
exports.registerView = registerView;
exports.importFromJSON = importFromJSON;
exports.getCommentList = getCommentList;
exports.bookmarkRemedy = bookmarkRemedy;