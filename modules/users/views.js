/**
 * Created by Jibin_ism on 27-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var control=requireFromModule('users/controller');
var fs=require('fs');
var handlebars=require('handlebars');

var getUserObject=function(req, signup){
    var user={};
    if(!signup){
        if(req.body.id) {
            user._id = req.body.id;
        }else{
            user._id = req.params.id;
        }
    }
    user.name=req.body.name;
    user.age=req.body.age;
    user.sex=req.body.sex;
    user.email=req.body.email;
    user.mobile=req.body.mobile;
    user.password=req.body.password;
    if(req.body.admin){
       user.admin=req.body.admin;
    }else{
        user.admin=false;
    }
    return user;
};

var signup = function (req, res) {
    var user = getUserObject(req, true);
    control.signUp(user, function(result){
        //console.log("Signup attempt: "+result);
        res.json(result);
    });

};

var login=function(req, res){
    var user=getUserObject(req);

    control.login(user, function(result){
        //console.log("Login Attempt: "+JSON.stringify(result));
        //if(result.success) {
        //    handlebars.print('./public/dashboard.html', {user: result.data});
        //}else{
        //    sendFile(res, './public/authen/login.html', options);
        //}
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
    var user=getUserObject(req.params.id);
    control.delete(user, function(result){
        res.json(result);
    });
};

var sendFile=function(res, file,options){
    fs.readFile(file, function(err, html){
      if(err){
          throw err;
      } else{
          res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
          res.write(html);
          res.end();
      }
    });
};

var loginForm=function(req, res){
    sendFile(res, './public/authen/login.html');
};

var signupForm=function(req, res){
    sendFile(res, './public/authen/signup.html');
};

exports.signUp=signup;
exports.login=login;
exports.update=update;
exports.delete=del;
exports.sendLoginForm=loginForm;
exports.sendSignUpForm=signupForm;