/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var user = requireFromModule('users/views');
var path = require('path');
var express = require('express');
var router = express.Router();


router.post('/signup', function (req, res) {
    //console.log('User Signup: '+JSON.stringify(req.body));
    user.signUp(req, res);
});

router.post('/login', function (req, res) {
    console.log('User Login');
    user.login(req, res);
});

router.put('/:id', function (req, res) {
    console.log("User data Edit...");
    user.update(req, res);
});

router.delete('/:id', function (req, res) {
    console.log("Delete User...");
    user.delete(req, res);
});

router.get('/', function (req, res) {
    console.log("Hello Guest");
    res.send("Hello Guest...");
});

//module.exports = router;

//app.use('/api', router);
//app.use('/api', router);
//

var defaultRouter=express.Router();

defaultRouter.get('/signup',function(req, res){
   user.sendSignUpForm(req, res);
});

defaultRouter.get('/login', function(req, res){
    user.sendLoginForm(req, res);
});

module.exports = function(app){
    app.use('/user',router);
    app.use(defaultRouter);
};

