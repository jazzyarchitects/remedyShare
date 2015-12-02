/**
 * Created by Jibin_ism on 26-Nov-15.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=new Schema({
   name:{
       type:String,
       required: true
   },
    age:{
        type: Number,
        required:false
    },
    sex:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    remedies:{
        type: [Schema.Types.ObjectId],
        required: false,
        ref:'Remedy'
    },
    comments:{
        type: [Schema.Types.ObjectId],
        required: false,
        ref:'Comment'
    },
    medicines:{
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'MedicineDetail'
    }
},{strict:false});

mongoose.model('User',UserSchema);
