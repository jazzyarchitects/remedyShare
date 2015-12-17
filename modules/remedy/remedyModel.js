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
    stats: {
        type: {
            upvote: {
                type: Number
            },
            downvote: {
                type: Number
            },
            views: {
                type: Number
            },
            comments: {
                type: Number
            }
        },
        required: false,
        'default': {
            upvote: 0,
            downvote: 0,
            views: 0,
            comments: 0
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
        'default': true
    },
    deletedComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Remedy', RemedySchema);
