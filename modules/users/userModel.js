/**
 * Created by Jibin_ism on 26-Nov-15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    sex: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        required: true,
        default: false
    },
    remedies: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'Remedy'
    },
    comments: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'Comment'
    },
    medicines: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: 'MedicineDetail'
    }
});


UserSchema.methods.toJSON = function (pass) {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        age: this.age,
        sex: this.sex,
        admin: this.admin
    }
};

module.exports = mongoose.model('User', UserSchema);
