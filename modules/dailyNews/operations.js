var mongoose = require('mongoose');
var config = require('../../config/development');
mongoose.connect(config.db.uri, config.db.options);
var DailyNews = require('./model');
var request = require('request');
var async = require('async');
var xml2js = require('xml2js');
var moment = require('moment');

var urls = {
  "DailyNews" : "http://www.medicinenet.com/rss/dailyhealth.xml",
  "Allergies": "http://www.medicinenet.com/rss/general/allergies.xml",
  "Alzheimer's Disease": "http://www.medicinenet.com/rss/general/alzheimers.xml",
  "Arthritis": "http://www.medicinenet.com/rss/general/arthritis.xml",
  "Asthma": "http://www.medicinenet.com/rss/general/asthma.xml",
  "Cancer": "http://www.medicinenet.com/rss/general/cancer.xml",
  "Cholesterol": "http://www.medicinenet.com/rss/general/cholesterol.xml",
  "Chronic Pain": "http://www.medicinenet.com/rss/general/chronic_pain.xml",
  "Cold & Flu": "http://www.medicinenet.com/rss/general/cold_and_flu.xml",
  "Depression": "http://www.medicinenet.com/rss/general/depression.xml",
  "Diabetes": "http://www.medicinenet.com/rss/general/diabetes.xml",
  "Diet": "http://www.medicinenet.com/rss/general/diet_and_weight_management.xml",
  "Digestion": "http://www.medicinenet.com/rss/general/digestion.xml",
  "Eyesight": "http://www.medicinenet.com/rss/general/eyesight.xml",
  "Hearing": "http://www.medicinenet.com/rss/general/hearing.xml",
  "Heart": "http://www.medicinenet.com/rss/general/heart.xml",
  "High Blood Pressure": "http://www.medicinenet.com/rss/general/high_blood_pressure.xml",
  "HIV": "http://www.medicinenet.com/rss/general/hiv.xml",
  "Infectious Disease": "http://www.medicinenet.com/rss/general/infectious_disease.xml",
  "Lung Conditions": "http://www.medicinenet.com/rss/general/lung_conditions.xml",
  "Medications": "http://www.medicinenet.com/rss/general/medications.xml",
  "Menopause": "http://www.medicinenet.com/rss/general/menopause.xml",
  "Men's Health": "http://www.medicinenet.com/rss/general/mens_health.xml",
  "Mental Health": "http://www.medicinenet.com/rss/general/mental_health.xml",
  "Migraine": "http://www.medicinenet.com/rss/general/migraine.xml",
  "Neurology": "http://www.medicinenet.com/rss/general/neurology.xml",
  "Oral Health": "http://www.medicinenet.com/rss/general/oral_health.xml",
  "Kids Health": "http://www.medicinenet.com/rss/general/kids_health.xml",
  "Pregnancy": "http://www.medicinenet.com/rss/general/pregnancy.xml",
  "Prevention & Wellness": "http://www.medicinenet.com/rss/general/prevention_and_wellness.xml",
  "Senior Health": "http://www.medicinenet.com/rss/general/senior_health.xml",
  "Sexual Health": "http://www.medicinenet.com/rss/general/sexual_health.xml",
  "Skin": "http://www.medicinenet.com/rss/general/skin.xml",
  "Sleep": "http://www.medicinenet.com/rss/general/sleep.xml",
  "Thyroid": "http://www.medicinenet.com/rss/general/thyroid.xml",
  "Travel Health": "http://www.medicinenet.com/rss/general/travel_health.xml",
  "Women's Health": "http://www.medicinenet.com/rss/general/womens_health.xml"
};

var fetchDailyNews = function(){
  return new Promise(function(resolve, reject){
    var keys = Object.keys(urls);
    async.forEachLimit(keys, 5, function(key, _cb){
      console.log("Fetching: "+urls[key]);
      request(urls[key], function(error, response, body){
        xml2js.parseString(body, function(err, result){
          if(err){
            console.log(key+"  Error parsing: "+JSON.stringify(err));
            return _cb();
          }
          if(!result){
            console.log("result undefined");
            return _cb();
          }
          var allNews = [];

          for(var obj of result.rss.channel[0].item){
            let news  = {};
            news.title = obj.title[0];
            news.link = obj.link[0];
            news.pubDate = obj.pubDate[0];
            allNews.push(news);
          }
          var d = moment().format("DD-MM-YYYY");
          d = d.split("-");
          var date = {
            dd: d[0],
            mm: d[1],
            yy: d[2]
          }
          console.log("D: "+JSON.stringify(d));

          var dailyNews = {};
          dailyNews.date = date;
          dailyNews.newsType = key;
          dailyNews.news = allNews;
          dailyNews.parentUrl = urls[key];
          DailyNews.update({date: date, newsType: key}, dailyNews, {upsert: true}, function(err, res){
            if(err){
              console.log("Error saving news: "+urls[key]+" :\n"+JSON.stringify(err));
            }
            console.log(key+" update res: "+JSON.stringify(res));
            _cb();
          })
        });
      });
    }, function(){
      console.log("Finished saving");
      resolve("Daily News Fetched and saved");
    });
  });
};


// exports.fetchDailyNews = fetchDailyNews;
fetchDailyNews()
.then(function(){
  process.exit(1);
});
