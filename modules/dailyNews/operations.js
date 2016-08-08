var DailyNews = require('./model');
var moment = require('moment');
var fetchDailyNews = require('./fetchDailyNews');

var fetchNewsItem = function(newsType, dd, mm, yy, exit){
  if(DailyNews.categories.indexOf(newsType) < 0){
    newsType = DailyNews.categories[0];
  }
  if(!dd || !mm || !yy){
    var d = moment().format("DD-MM-YYYY");
    d = d.split("-");
    dd= d[0];
    mm= d[1]
    yy= d[2]
  }
  return new Promise(function(resolve, reject){
    DailyNews.findOne({date: {dd: dd, mm: mm, yy: yy}, newsType: newsType}, function(err, news){
      if(err){
        return resolve(errorJSON(501, "Mongo Error" , err));
      }
      if(doc && doc.news.length > 1){
        return resolve(successJSON(doc));
      }else{
        if(exit){
          return resolve(errorJSON(502, "Unable to fetch news item", "Try parent url"));
        }
        fetchDailyNews()
        .then(function(){
          fetchNewsItem(newsType, dd, mm, yy, true);
        });
      }
    });
  });
}

exports.fetchNewsItem = fetchNewsItem;
