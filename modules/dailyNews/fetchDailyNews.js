var mongoose = require('mongoose');
var config = require('../../config/development');
// mongoose.connect(config.db.uri, config.db.options);
var DailyNews = require('./model');
var request = require('request');
var async = require('async');
var xml2js = require('xml2js');
var moment = require('moment');

var urls = {
  "dailyhealth" : "http://www.medicinenet.com/rss/dailyhealth.xml",
  "allergies": "http://www.medicinenet.com/rss/general/allergies.xml",
  "alzheimers": "http://www.medicinenet.com/rss/general/alzheimers.xml",
  "arthritis": "http://www.medicinenet.com/rss/general/arthritis.xml",
  "asthma": "http://www.medicinenet.com/rss/general/asthma.xml",
  "cancer": "http://www.medicinenet.com/rss/general/cancer.xml",
  "cholesterol": "http://www.medicinenet.com/rss/general/cholesterol.xml",
  "chronic_pain": "http://www.medicinenet.com/rss/general/chronic_pain.xml",
  "cold_and_flu": "http://www.medicinenet.com/rss/general/cold_and_flu.xml",
  "depression": "http://www.medicinenet.com/rss/general/depression.xml",
  "diabetes": "http://www.medicinenet.com/rss/general/diabetes.xml",
  "diet": "http://www.medicinenet.com/rss/general/diet_and_weight_management.xml",
  "digestion": "http://www.medicinenet.com/rss/general/digestion.xml",
  "eyesight": "http://www.medicinenet.com/rss/general/eyesight.xml",
  "hearing": "http://www.medicinenet.com/rss/general/hearing.xml",
  "heart": "http://www.medicinenet.com/rss/general/heart.xml",
  "high_blood_pressure": "http://www.medicinenet.com/rss/general/high_blood_pressure.xml",
  "hiv": "http://www.medicinenet.com/rss/general/hiv.xml",
  "infectious_disease": "http://www.medicinenet.com/rss/general/infectious_disease.xml",
  "lung_conditions": "http://www.medicinenet.com/rss/general/lung_conditions.xml",
  "medications": "http://www.medicinenet.com/rss/general/medications.xml",
  "menopause": "http://www.medicinenet.com/rss/general/menopause.xml",
  "mens_health": "http://www.medicinenet.com/rss/general/mens_health.xml",
  "mental_health": "http://www.medicinenet.com/rss/general/mental_health.xml",
  "migraine": "http://www.medicinenet.com/rss/general/migraine.xml",
  "neurology": "http://www.medicinenet.com/rss/general/neurology.xml",
  "oral_health": "http://www.medicinenet.com/rss/general/oral_health.xml",
  "kids_health": "http://www.medicinenet.com/rss/general/kids_health.xml",
  "pregnancy": "http://www.medicinenet.com/rss/general/pregnancy.xml",
  "prevention_and_wellness": "http://www.medicinenet.com/rss/general/prevention_and_wellness.xml",
  "senior_health": "http://www.medicinenet.com/rss/general/senior_health.xml",
  "sexual_health": "http://www.medicinenet.com/rss/general/sexual_health.xml",
  "skin": "http://www.medicinenet.com/rss/general/skin.xml",
  "sleep": "http://www.medicinenet.com/rss/general/sleep.xml",
  "thyroid": "http://www.medicinenet.com/rss/general/thyroid.xml",
  "travel_health": "http://www.medicinenet.com/rss/general/travel_health.xml",
  "womens_health": "http://www.medicinenet.com/rss/general/womens_health.xml"
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
// fetchDailyNews()
// .then(function(){
//   process.exit(1);
// });

module.exports = fetchDailyNews;
