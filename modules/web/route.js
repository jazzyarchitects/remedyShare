/**
 * Created by Jibin_ism on 31-Dec-15.
 */


var express = require('express');
var router = express.Router();
var noPrefixRouter = express.Router();
var view = requireFromModule('web/views');
var cookieParser = require('cookie-parser');
var fs = require('fs');

router.use(express.static('public'));

noPrefixRouter.get('/', function (req, res) {
    fs.readFile('./public/medicalAssistant.html', function (err, html) {
        if (err) {
            throw err;
        } else {
            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': html.length});
            res.write(html);
            res.end();
        }
    });
});

router.get('/', function (req, res) {
    authenticateUser(req, res, function (result) {
        if (result.success) {
            //TODO: send remedy feed
            view.sendUserFeed(req, res);
        } else {
            res.redirect('/app/login');
        }
    });
});

router.get('/signup', function (req, res) {
    authenticateUser(req, res, function (result) {
        if (result.success) {
            res.redirect('/app');
        } else {
            view.sendSignUpForm(req, res);
        }
    });
});

router.get('/login', function (req, res) {
    authenticateUser(req, res, function (result) {
        if (result.success) {
            res.redirect('/app');
        } else {
            view.sendLoginForm(req, res);
        }
    });
});

module.exports = function (app) {
    app.use('/app', router);
    app.use(noPrefixRouter);
};