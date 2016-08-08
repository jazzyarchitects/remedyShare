var Operations = require('./operations');

var fetchDailyNews = function(req, res){
  Operations.fetchNewsItem(req.params.newsType, req.params.dd, req.params.mm, req.params.yy)
  .then(function(result){
    res.json(result);
  });
}

exports.fetchDailyNews = fetchDailyNews;
