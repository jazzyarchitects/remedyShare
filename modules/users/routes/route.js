/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var user = requireFromModule('users/views/user');
var path = require('path');


app.post('/signup', function (req, res) {
    //console.log('User Signup: '+JSON.stringify(req.body));
    user.signUp(req, res);
});

app.post('/login',function(req, res){
    console.log('User Login');
    user.login(req, res);
});

app.put('/user', function(req, res){
    console.log("User data Edit...");
    user.update(req, res);
});

app.delete('/user',function(req, res){
    console.log("Delete User...");
    user.delete(req, res);
});

app.get('/',function(req, res){
    console.log("Hello Guest");
    res.send("Hello Guest...");
});

