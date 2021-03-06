/**
 * Created by Jibin_ism on 27-Nov-15.
 */
'use strict';

var path = requireFromModule('path');
var control = requireFromModule('users/controller');
var fs = require('fs');

var getUserObject = function (req, signup) {
    var user = {};
    user.name = req.body.name;
    user.dob = {};
    var dob = req.body.dob;
    if (dob) {
        var days = dob.split("-");
        //console.log("Days: "+days);
        user.dob.dd = days[0];
        user.dob.mm = days[1];
        user.dob.yyyy = days[2];
    }
    user.sex = req.body.sex;
    user.email = req.body.email;
    user.mobile = req.body.mobile;
    user.password = req.body.password;
    //if (req.body.admin) {
    //    user.admin = req.body.admin;
    //} else {
    user.admin = false;
    //}
    return user;
};

var signup = function (req, res) {
    var user = getUserObject(req, true);
    control.signUp(user, req.service, function (result) {
        //console.log("Service: "+req.service);
        if (result.data) {
            var client = result.data.client;
            res.cookie("user", JSON.stringify({
                key: client.key,
                id: client.id
            }), {expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)});
            //res.cookie("accessToken",result.data.detail._id,{expires: new Date(Date.now()+365*24*60*60*1000)});
        }
        res.json(result);
    });

};


var login = function (req, res) {
    var user = getUserObject(req);

    //console.log("Login: "+JSON.stringify(req.body));
    control.login(user, req.service, function (result) {

        if (result.data) {
            var client = result.data.client;
            res.cookie("user", JSON.stringify({
                key: client.key,
                id: client.id
            }), {expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)});
            //res.cookie("accessToken",result.data.detail._id,{expires: new Date(Date.now()+365*24*60*60*1000)});
        }
        res.json(result);
    });

};

var update = function (req, res) {
    var user = getUserObject(req);
    user._id = req.user;
    control.update(user, function (result) {
        res.json(result);
    });
};

var del = function (req, res) {
    var user = getUserObject(req.user);
    control.delete(user, function (result) {
        res.json(result);
    });
};

var remedyList = function (req, res) {
    control.remedyList(req.user, req.params.page || 1, function (result) {
        res.json(result);
    });
};

var otherRemedyList = function (req, res) {
    control.remedyList(req.params.id, req.params.page || 1, function (result) {
        res.json(result);
    });
};

var getUserData = function (id, res) {
    control.getUserData(id, function (result) {
        res.json(result);
    });
};

var uploadProfilePicture = function (req, res) {
    //console.log("Files: "+JSON.stringify(req.file));
    //console.log("Body: "+JSON.stringify(req.body));
    control.uploadProfilePicture(req.user, req.file, function (result) {
        res.json(result);
    });
};

var logout = function (req, res) {
    control.logout(req.user, function (result) {
        res.json(result);
    });
};

var loginSocial = function (stream, req, res) {
    control.loginSocial(stream, req.body.accessToken, function(result){
        if (result.data) {
            var client = result.data.client;
            res.cookie("user", JSON.stringify({
                key: client.key,
                id: client.id
            }), {expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)});
            //res.cookie("accessToken",result.data.detail._id,{expires: new Date(Date.now()+365*24*60*60*1000)});
        }
        res.json(result);
    });
};

var getSelfProfile = function(req, res){
    if(!req.user){
        res.json(errorJSON(501, "UNAUTHORISED", "LOGIN_TO_VIEW"));
        res.end();
        return;
    }
  control.getUserProfile(req.user, function(result){
        res.json(result);
  });
};

var uploadAppData = function(req, res){
    control.uploadAppData(req, function(result){
        res.json(successJSON());
    });
};

var downloadAppData = function(req, res){
    control.downloadAppData(req, function(result){
        res.json(result);
    });
};

exports.signUp = signup;
exports.login = login;
exports.update = update;
exports.delete = del;
exports.remedyList = remedyList;
exports.othersRemedyList = otherRemedyList;
exports.getUser = getUserData;
exports.uploadProfilePicture = uploadProfilePicture;
exports.logout = logout;
exports.loginSocial = loginSocial;
exports.getSelfProfile = getSelfProfile;
exports.uploadAppData =uploadAppData;
exports.downloadAppData  = downloadAppData;