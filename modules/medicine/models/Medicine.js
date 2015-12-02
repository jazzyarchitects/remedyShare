/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose=require('mongoose');

var MedicineSchema = new Schema({
   name:{
       type: String,
       required: true
   },
    users:{
        type: [Schema.Types.ObjectId],
        ref:'User',
        required: false
    },
    doctors:{
        type: [Schema.Types.ObjectId],
        ref: 'Doctor',
        required: false
    }
});

mongoose.model('Medicine',MedicineSchema);