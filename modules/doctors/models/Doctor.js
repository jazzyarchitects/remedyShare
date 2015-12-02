/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose=require('mongoose');

var DoctorSchema = new Schema({
   name:{
       type: String,
       required: true
   },
    medicines:{
        type: [Schema.Types.ObjectId],
        ref: 'Medicine',
        required: false
    },
    address:{
        type: [String],
        required: false
    },
    hospital:{
        type: [String],
        required: false
    },
    mobile:{
        type: String,
        required: false
    },
    office:{
        type: String,
        required: false
    },
    users:{
        type: [Schema.Types.ObjectId],
        ref:'User',
        required: false
    }
});

mongoose.model('Doctor',DoctorSchema);