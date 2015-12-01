/**
 * Created by Jibin_ism on 27-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var control=requireFromModule('users/controllers/user');

var getUserObject=function(req){
    var user={};
    user._id=req.body.id;
    user.name=req.body.name;
    user.age=req.body.age;
    user.sex=req.body.sex;
    user.email=req.body.email;
    user.mobile=req.body.mobile;
    user.password=req.body.password;
    return user;
};

var signup = function (req, res) {
    var user = getUserObject(req);
    control.signUp(user, function(result){
        console.log("Signup attempt: "+result);
        res.json(result);
    });

};

var login=function(req, res){
    var user=getUserObject(req);

    control.login(user, function(result){
        console.log("Login Attempt: "+result);
        res.json(result);
    });

};

var update=function(req, res){
    var user = getUserObject(req);
    control.update(user, function(result){
       res.json(result);
    });
};

var del=function(req, res){
    var user=getUserObject(req);
    control.delete(user, function(result){
        res.json(result);
    });
};

exports.signUp=signup;
exports.login=login;
exports.update=update;
exports.delete=del;
