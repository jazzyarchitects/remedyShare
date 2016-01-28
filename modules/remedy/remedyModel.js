/**
 * Created by Jibin_ism on 26-Nov-15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RemedySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    oldId: {
        type:Schema.Types.ObjectId,
        select: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    references: {
        type: [String],
        required: false
    },
    tags: [String],
    diseases: [String],
    image: {
        type: {
            filename: String,
            path: String
        }
    },
    rankIndex: {
        type: Number,
        required: true,
        'default': 0
    },
    stats: {
        type: {
            upvote: Number,
            downvote: Number,
            views: Number,
            comments: Number,
            bookmarked_by: Number
        },
        required: false,
        'default': {
            upvote: 0,
            downvote: 0,
            views: 0,
            comments: 0,
            bookmarked_by:0
        }
    },
    publishedOn: {
        type: Schema.Types.Date,
        required: true,
        'default': Date.now
    },
    upvote: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }],
    downvote: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Comment'
    }],
    active: {
        type: Boolean,
        required: true,
        'default': true,
        select: false
    },
    deletedComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        select: false
    }],
    bookmarked_by:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

RemedySchema.index({
    title: 'text',
    description: 'text',
    references: 'text',
    tags: 'text',
    diseases: 'text'
}, {
    name: "best_match_index",
    weights: {
        references: 1,
        title: 5,
        description: 4,
        tags: 13,
        diseases: 15
    }
});

RemedySchema.pre('save', function (next) {
    var diseases = this.diseases;
    for (var i = 0; i < diseases.length; i++) {
        diseases[i] = diseases[i].toLowerCase();
    }
    this.rankIndex = (new Date()).getTime();
    next();
});

RemedySchema.statics.registerView = function (_id) {
    //console.log("Registering View static: "+_id.toString());
    if(!mongoose.Types.ObjectId.isValid(_id)){
        _id=mongoose.Types.ObjectId(_id);
    }
    this.findOne({_id: _id}, function (err, doc) {
        if (err) {
            console.log("Error in registeringView for remedy: " + JSON.stringify(err));
        } else {
            var p = (doc.rankIndex + (new Date()).getTime()) / 2;
            this.update({_id: _id}, {
                $set: {
                    $inc: {"stats.views": 1},
                    rankIndex: p
                }
            })
        }
    });
};

RemedySchema.statics.updateRankingIndex = function (_id, control) {
    control = control > 0 ? 1 : -1;
    this.findOne({_id: _id}, function (err, doc) {
        if (err) {
            console.log("Error in updatingRankingIndex for remedy: " + JSON.stringify(err));
        } else {
            var p = ((doc.rankIndex + (new Date()).getTime()) / 2) + ((control) * ((new Date()).getTime()) / 3);
            this.update({_id: _id}, {
                $set: {rankIndex: p}
            });
        }
    });
};

module.exports = mongoose.model('Remedy', RemedySchema);
