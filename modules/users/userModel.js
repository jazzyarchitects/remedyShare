/**
 * Created by Jibin_ism on 26-Nov-15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    sex: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    remedies: [{
        type: Schema.Types.ObjectId,
        ref: 'Remedy'
    }],
    comments:[{
       type: Schema.Types.ObjectId,
        required: false,
        ref: 'Comment'
    }],
    medicines: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'MedicineDetail'
    }],
    created_at: {
        type: Schema.Types.Date,
        required: true,
        'default': Date.now
    },
    stats: {
        type: {
            remedies: {
                type: Number,
                required: false
            },
            comments: {
                type: Number,
                required: false
            },
            medicines: {
                type: Number,
                required: false
            },
            deleted: {
                type: {
                    remedies: Number,
                    medicines: Number,
                    comments: Number
                }
            },
            remedyVotes: {
                type: {
                    upvote: Number,
                    downvote: Number
                }
            }
        },
        required: true,
        'default': {
            remedies: 0,
            comments: 0,
            medicines: 0,
            deleted: {
                remedies: 0,
                medicines: 0,
                comments: 0
            },
            remedyVotes: {
                upvotes: 0,
                downvotes: 0
            }
        }
    },
    remedyVotes: {
        type: {
            upvote: [{
                type: Schema.Types.ObjectId,
                ref: 'Remedy'
            }],
            downvote: [{
                type: Schema.Types.ObjectId,
                ref: 'Remedy'
            }]
        }
    },
    deleted: {
        type: {
            remedies: [{
                type: Schema.Types.ObjectId,
                unique: true,
                ref: 'Remedy'
            }],
            medicines: [{
                type: Schema.Types.ObjectId,
                unique: true,
                ref: 'MedicineDetails'
            }],
            comments:[{
                type: Schema.Types.ObjectId,
                unique: true,
                ref: 'Comment'
            }]
        }
    }
});


UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    //delete obj.deleted;
    //delete obj."stats.deleted";
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
