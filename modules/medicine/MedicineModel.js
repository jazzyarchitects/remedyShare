/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicineDetailSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    endDate: {
        type: Schema.Types.Date,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    doctors: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Doctor'
    },
    days: {
        type:{
            sunday: Boolean,
            monday: Boolean,
            tuesday: Boolean,
            wednesday: Boolean,
            thursday: Boolean,
            friday: Boolean,
            saturday: Boolean,
        },
        required: true,
        'default':{
            sunday: true,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true
        }
    },
    timings: {
        type: {
            breakfast: {
                type: String,
                'default': "none"
            },
            lunch: {
                type: String,
                'default': "none"
            },
            dinner: {
                type: String,
                'default': "none"
            },
            custom:{
                type: String,
                'default': "none"
            }
        }
    },
    icon:Number,
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active:{
        type: Boolean,
        required: true,
        'default': true
    }
});


//MedicineDetailSchema.statics.getBeforeAfterString = function (timingField) {
//    switch (timingField) {
//        case -1:
//            return "none";
//        case 0:
//            return "before";
//        case 1:
//            return "after";
//        default :
//            return "none";
//    }
//};

module.exports = mongoose.model('Medicine', MedicineDetailSchema);

