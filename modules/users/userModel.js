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
    oldId: {
        type: Schema.Types.ObjectId,
        select: false
    },
    dob: {
        type: {
            dd: Number,
            mm: Number,
            yyyy: Number
        },
        required: false,
        'default': {
            dd: 0,
            mm: 0,
            yyyy: 0
        }
    },
    sex: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    },
    remedies: [{
        type: Schema.Types.ObjectId,
        ref: 'Remedy'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Comment'
    }],
    medicines: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Medicine'
    }],
    doctors: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Doctor'
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
                },
                select: false
            },
            remedyVotes: {
                type: {
                    upvote: Number,
                    downvote: Number
                }
            },
            bookmarks: {
                type: {
                    remedies: Number
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
            },
            bookmarks: {
                remedies: 0
            }
        }
    },
    image: {
        type: {
            filename: String,
            path: String,
            url: String
        },
        'default': {
            filename: "",
            path: "",
            url: ""
        }
    },
    bookmarks: {
        type: {
            remedies: [{
                type: Schema.Types.ObjectId,
                ref: 'Remedy'
            }]
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
        },
        select: false
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
            comments: [{
                type: Schema.Types.ObjectId,
                unique: true,
                ref: 'Comment'
            }]
        },
        select: false
    },
    settings: {
        notification: {
            type: Boolean,
            'default': false
        },
        popup: {
            type: Boolean,
            'default': false
        },
        timings: {
            beforeBreakfast: {
                type: String,
                'default': "08:00"
            },
            afterBreakfast: {
                type: String,
                'default': "10:00"
            },
            beforeLunch: {
                type: String,
                'default': "12:00"
            },
            afterLunch: {
                type: String,
                'default': "14:00"
            },
            beforeDinner: {
                type: String,
                'default': "20:00"
            },
            afterDinner: {
                type: String,
                'default': "22:00"
            }
        }
    }
});


module.exports = mongoose.model('User', UserSchema);
