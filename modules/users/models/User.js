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
    }
});

mongoose.model('User',UserSchema);
