/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Timing Convention:
 * -1 - None
 * 0 - Before
 * 1 - After
 * @type {Schema}
 */


var MedicineDetailSchema = new Schema({
    medicine: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
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
    doctor: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Doctor'
    },
    days: {
        type: String,
        required: true,
        'default': '1111111'
    },
    timings: {
        type: {
            breakfast: {
                type: Number,
                'default': -1
            },
            lunch: {
                type: Number,
                'default': -1
            },
            dinner: {
                type: Number,
                'default': -1
            },
            custom:{
                type: String,
                'default': "none"
            }
        }
    }
});


MedicineDetailSchema.statics.getBeforeAfterString = function (timingField) {
    switch (timingField) {
        case -1:
            return "none";
        case 0:
            return "before";
        case 1:
            return "after";
        default :
            return "none";
    }
};

module.exports = mongoose.model('MedicineDetail', MedicineDetailSchema);

