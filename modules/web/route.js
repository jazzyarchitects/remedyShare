/**
 * Created by Jibin_ism on 31-Dec-15.
 */


var express = require('express');
var router = express.Router();
var noPrefixRouter = express.Router();
var view = requireFromModule('web/views');
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

printRoutes(noPrefixRouter, 'Routes.json', true);

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

router.use(function (req, res, next) {
    authenticateUser(req, res, function (result) {
        if (result.success || req.guestUser) {
            req.loggedIn = result.success;
            //console.log("req.loggedIn: "+req.loggedIn);
            next();
        } else {
            res.redirect('/app/login');
        }
    });
});

router.get('/', function (req, res) {
    if (req.loggedIn) {
        view.sendUserFeed(req, res);
    } else {
        view.sendFile(res, './public/remedyFeed_noUser.html');
    }
});

router.get('/remedy', function (req, res) {
    view.sendRemedyList(req, res);
});


printRoutes(router, 'appRoutes.json', true);


var myRouter = express.Router();
myRouter.use(express.static('public'));

myRouter.use(function (req, res, next) {
    authenticateUser(req, res, function (result) {
        if (result.success) {
            next();
        } else {
            res.redirect('/app/login');
        }
    });
});

myRouter.get('/remedy', function (req, res) {
    view.sendNewRemedyForm(req, res);
});

myRouter.get('/details', function (req, res) {
    view.sendUserDetails(req, res);
});


printRoutes(myRouter, 'app-myRoutes.json', true);


module.exports = function (app) {
    router.use('/my', myRouter);
    app.use('/app', router);
    app.use(noPrefixRouter);
};