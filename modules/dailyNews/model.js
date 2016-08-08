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

DailyNewsSchema.statics.categories = [
"dailyhealth",
"allergies",
"alzheimers",
"arthritis",
"asthma",
"cancer",
"cholesterol",
"chronic_pain",
"cold_and_flu",
"depression",
"diabetes",
"diet",
"digestion",
"eyesight",
"hearing",
"heart",
"high_blood_pressure",
"hiv",
"infectious_disease",
"lung_conditions",
"medications",
"menopause",
"mens_health",
"mental_health",
"migraine",
"neurology",
"oral_health",
"kids_health",
"pregnancy",
"prevention_and_wellness",
"senior_health",
"sexual_health",
"skin",
"sleep",
"thyroid",
"travel_health",
"womens_health"
];


module.exports = mongoose.model('DailyNews', DailyNewsSchema);
