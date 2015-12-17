/**
 * Created by Jibin_ism on 01-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    publishedOn: {
        type: Date,
        required: true,
        'default': Date.now
    },
    comment: {
        type: String,
        required: true
    },
    remedy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Remedy'
    },
    active:{
        type: Boolean,
        required: true,
        'default': true
    }
});

module.exports = mongoose.model('Comment', CommentSchema);