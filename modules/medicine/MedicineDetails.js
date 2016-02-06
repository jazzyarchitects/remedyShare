/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Timing Convention:
 * 00 - None
 * 01 - Before
 * 10 - After
 * @type {Schema}
 */

var TimeSchema = new Schema({
    breakfast: String,
    lunch: String,
    dinner: String
});


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
    breakfast: {}
});

module.exports = mongoose.model('MedicineDetail', MedicineDetailSchema);

