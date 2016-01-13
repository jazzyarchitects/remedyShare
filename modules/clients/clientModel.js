/**
 * Created by Jibin_ism on 09-Dec-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Hash = requireFromModule('clients/cryptoOperations');

var clientSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: String,
        'default': "undefined",
        required: true
    },
    key: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        'default': Date.now
    }
});

clientSchema.pre('save', function (next, done) {
    var self=this;
    mongoose.models["Client"].find({key: this.key, id: this.id}, function (err, doc) {
        if (doc) {
            if (doc.length > 1) {
                var id = uuid.v4();
                var api_key = uuid.v4();
                Hash.hashKey(api_key, function (result) {
                    if (result.success) {
                        var client = new clientSchema({
                            user: self.user,
                            key: result.hash,
                            id: id,
                            service: self.service
                        });
                        client.save(function (err, doc) {
                            console.log("ClientSchema: saving: err:" + JSON.stringify(err)+" success: "+JSON.stringify(doc));
                            if (err) {
                                this.invalidate("_id", "unable to save");
                                done(err);
                            } else {
                                done(doc);
                            }
                        });
                    } else {
                        done(result.err);
                    }
                });
            } else {
                next();
            }
        } else {
            console.log("ClientSchema: Error saving");
            next();
        }
    })
});

module.exports = mongoose.model('Client', clientSchema);