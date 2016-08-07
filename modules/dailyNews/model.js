var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  link: String,
  pubDate: String
});

var DailyNewsSchema = new Schema({
  date:{
    type:{
      dd: {
        type: Number,
        min: 1,
        max: 31
      },
      mm: {
        type: Number,
        min: 1,
        max: 12
      },
      yy: {
        type: Number,
        min: 2016
      }
    },
    required: true,
  },
  newsType:{
    type: String,
    required: true
  },
  news: [ArticleSchema],
  parentUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DailyNews', DailyNewsSchema);
