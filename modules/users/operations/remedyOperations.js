/**
 * Created by Jibin_ism on 27-Jan-16.
 */
var mongoose = require('mongoose');
var User = requireFromModule('users/userModel');
var PAGE_LIMIT = 5;

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
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        user_id=mongoose.Types.ObjectId(user_id);
    }
    User.findOne({_id: user_id})
        .populate({
            path: "remedies",
            match: {active: true},
            select: 'title description publishedOn stats diseases',
            options: {limit: PAGE_LIMIT, skip: (page - 1) * PAGE_LIMIT},
            sort: {publishedOn: 1}
        })
        .select("_id remedies")
        .exec(function (err, doc) {
            //console.log("UserOperations: result:"+JSON.stringify(err)+" "+JSON.stringify(doc));
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
        //console.log("Update upvote: " + JSON.stringify(err) + " " + JSON.stringify(doc));
    });
    User.update({
        _id: user,
        "remedyVotes.downvote": remedy
    }, {
        $inc: {"stats.remedyVotes.downvote": -1},
        $pull: {"remedyVotes.downvote": remedy}
    }, function (err, doc) {
        //console.log("Update downvote: " + JSON.stringify(err) + " " + JSON.stringify(doc));
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
            //console.log("Unlinking Remedy from user: " + JSON.stringify(doc) + " " + JSON.stringify(err));
            if (doc) {
                callback(true)
            } else {
                callback(false);
            }
        }
    )
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
                //console.log("Updating upvote in user: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                //callback(true);
            });
        } else {
            //console.log("Updating upvote in user (else):" + JSON.stringify(err) + " " + JSON.stringify(doc));
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
                //console.log("Updating downvote in user: " + JSON.stringify(err) + " " + JSON.stringify(doc));
                //callback(true);
            });
        } else {
            //console.log("Updating downvote in user (else):" + JSON.stringify(err) + " " + JSON.stringify(doc));
            //callback(true);
        }
    });
};

var bookmarkRemedy = function(user_id, remedy_id, callback){
    if(!mongoose.Types.ObjectId(remedy_id)){
        remedy_id=mongoose.Types.ObjectId(remedy_id);
    }
    User.update({
        _id: user_id,
        "bookmarks.remedies": remedy_id
    },{
        $inc: {"stats.bookmarks.remedies": -1},
        $pull: {"bookmarks.remedies": remedy_id}
    }, function(err, doc){
       if(err){
           callback(false);
       } else{
           if(doc.nModified === 1){
               callback(true);
           }else{
               User.update({
                   _id:user_id,
                   "bookmarks.remedies": {$ne: remedy_id}
               },{
                   $inc: {"stats.bookmarks.remedies": 1},
                   $push: {"bookmarks.remedies": remedy_id}
               }, function(err, doc){
                  if(err){
                      callback(false);
                  } else{
                      callback(true);
                  }
               });
           }
       }
    });
};

exports.linkRemedy = insertRemedy;
exports.getRemedyList = remedyList;
exports.unlinkRemedy = unlinkRemedy;
exports.upvoteRemedy = upvoteRemedy;
exports.downvoteRemedy = downvoteRemedy;
exports.bookmarkRemedy = bookmarkRemedy;