/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var user = requireFromModule('users/views/user');
var path = require('path');


app.post('/signup', function (req, res, next) {
    console.log('User Signup');
    user.signUp(req, res);
    next();
});

app.post('/login',function(req, res, next){
    console.log('User Login');
    user.login(req, res);
    next();
});

app.put('/edit', function(req, res, next){
    console.log("User data Edit...");
    user.update(req, res);
    next();
});