var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contacts:{
        type:{
            phone1: String,
            phone2: String
        }
    },
    address: String,
    hospital: String,
    active: {
        type: Boolean,
        'default': true
    },
    medicines:[{
        type: Schema.Types.ObjectId,
        ref: 'Medicine'
    }],
    appId:{
        type: String,
        required: true
    },
    notes:String
});

module.exports = mongoose.model('Doctor', doctorSchema);