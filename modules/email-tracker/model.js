var mongoose = require('mongoose');

var receiverSchema = new mongoose.Schema({
  receiver: {
    type: String,
    required: true
  },
  created: {
    type: Schema.Types.Date,
    required: true,
    'default': Date.now
  },
  status: {
    type: String,
    required: true,
    'default': 'unread'
  },
  readOn:{
    type: Schema.Types.Date,
    required: true,
    'default': Date.now
  }
});

receiverSchema.prototype.markRead = function(cb) {
  this.status = "read";
  this.save(function(err, doc){
    cb(err, doc);
  });
};

module.exports = mongoose.model('EmailReceiver', receiverSchema);
