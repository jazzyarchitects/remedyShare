/**
 * Created by Jibin_ism on 02-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: false
    },
    doctors: {
        type: [String],
        required: false
    }
});


//TODO
MedicineSchema.pre('save', function (next, done) {
    var medName = this.name.toLowerCase();
    this.name = medName;
    var self = this;
    this.findOne({name: medName}, function(err, doc){
       if(err){
           done(err, null);
       } else{
           var medicine = doc;
       }
    });
});

module.exports = mongoose.model('Medicine', MedicineSchema);