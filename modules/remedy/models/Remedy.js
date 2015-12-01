/**
 * Created by Jibin_ism on 26-Nov-15.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var RemedySchema=new Schema({
    author:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    stats:{
        type:{
            upvote:{
                type:Number
            },
            downvote:{
                type: Number
            },
            views:{
                type: Number
            },
            comments:{
                type: Number
            }
        },
        required: true,
        'default':{
            upvote: 0,
            downvote: 0,
            views: 0,
            comments: 0
        }
    },
    publishedOn:{
        type: Schema.Types.Date,
        required: true,
        'default': Date.now
    },
    upvote:{
        type: [Schema.Types.ObjectId],
        required: false
    },
    downvote:{
        type: [Schema.Types.ObjectId],
        required: false
    },
    comments:{
        type: [Schema.Types.ObjectId],
        required: false
    }

});

mongoose.model('Remedy',RemedySchema);
