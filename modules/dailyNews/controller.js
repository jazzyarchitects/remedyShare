var Operations = require('./operations');

var fetchDailyNews = function(req, res){
  Operations.fetchDailyNews()
  .then(function(result){
    res.json(successJSON(result));
  });
}
