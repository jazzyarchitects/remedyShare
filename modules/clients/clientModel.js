/**
 * Created by Jibin_ism on 09-Dec-15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var clientSchema=new Schema({
   user: {
       type: Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   },
    key:{
        type: String,
        required: true
    },
    id:{
        type:String,
        required: true
    },
    created_at:{
        type: Date,
        required: true,
        'default': Date.now
    }
});

module.exports = mongoose.model('Client',clientSchema);