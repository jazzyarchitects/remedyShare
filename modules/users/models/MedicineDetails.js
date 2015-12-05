/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

/**
 * Timing Convention:
 * 00 - None
 * 01 - Before
 * 10 - After
 * @type {Schema}
 */

var MedicineDetailSchema=new Schema({
   medicine:{
       type: Schema.Types.ObjectId,
       ref: 'Medicine',
       required: true
   },
    endDate:{
        type: Schema.Types.Date,
        required: false
    },
    note:{
        type: String,
        required: false
    },
    doctor:{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Doctor'
    }
});

mongoose.model('MedicineDetail',MedicineDetailSchema);

