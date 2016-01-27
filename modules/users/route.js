/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var user = requireFromModule('users/views');
var path = require('path');
var express = require('express');
var remedy = requireFromModule('remedy/views');
var router = express.Router();
var multer=require('multer');
router.use(multer({'dest': './uploads/images/users/'}).single('image'));

router.post('/signup', function (req, res) {
    //console.log('User Signup: '+JSON.stringify(req.body));
    user.signUp(req, res);
});

router.post('/login', function (req, res) {
    //console.log('User Login');
    user.login(req, res);
});

router.post('/login/google', function(req, res){
    //console.log("Google login");
   user.loginSocial("google", req, res);
});

router.post('/login/fb', function(req, res){
   user.loginSocial("facebook", req, res);
});

router.get('/', function (req, res) {
        user.getUser(req.user, res);
});


router.get('/:id', function(req, res){
    user.getUser(req.params.id, res);
});

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});


router.put('/', function (req, res) {
    //console.log("User data Edit...");
    user.update(req, res);
});

router.delete('/', function (req, res) {
    //console.log("Delete User...");
    user.delete(req, res);
});

router.get('/logout', function(req, res){
   user.logout(req, res);
});




router.get('/:id/remedy/', function(req, res){
    user.othersRemedyList(req, res);
});

router.get('/:id/remedy/:page', function(req, res){
   user.othersRemedyList(req, res);
});

router.get('/remedy/all', function(req, res){
   user.remedyList(req, res);
});

router.get('/remedy/:page', function (req, res) {
    user.remedyList(req, res);
});

router.put('/profilePicture', function(req, res){
   user.uploadProfilePicture(req, res);
});

module.exports = function (app) {
    app.use('/user', router);
};

