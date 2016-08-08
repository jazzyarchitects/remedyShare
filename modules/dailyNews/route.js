/**
 * Created by jibinmathews on 8/8/16.
 */
var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.get('/:newsType/:dd/:mm/:yy', function(req, res){
  controller.fetchNewsItem(req, res);
});


printRoutes(router, 'dailyNewsRoutes.json');

module.exports = function(app){
  app.use('/doctor', router);
};
