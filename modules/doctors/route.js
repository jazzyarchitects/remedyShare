/**
 * Created by jibinmathews on 21/3/16.
 */

var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});

router.get('/', function(req, res){

});


printRoutes(router, 'doctorRoutes.json');

module.exports = function(app){
  app.use('/doctor', router);
};