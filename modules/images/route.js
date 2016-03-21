/**
 * Created by Jibin_ism on 08-Jan-16.
 */

var express= require('express');
var router = express.Router();
var view=requireFromModule('images/views');

router.get('/remedy/:filename', function(req, res){
    view.sendRemedyPic(req, res);
});

router.get('/user/:filename', function(req, res){
    view.sendUserPic(req, res);
});
printRoutes(router,'imageRoutes.json', false);

module.exports  = function(app){
  app.use('/images', router);
};