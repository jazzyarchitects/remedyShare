'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var compression = require('compression');
var consolidate = require('consolidate');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var config = require('./config');
var fs=require('fs');
var ClientOperations = requireFromModule('clients/operations');
//var router=express.Router();


module.exports = function (app) {

    // app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(compression({
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // assign the template engine to .html files
    //app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
	app.set('secretKey', config.keys.token);
    app.set('view engine', 'html');

    // Set views path, template engine and default layout
    // app.set('views', config.root + '/server/views');

    // Enable jsonp
    app.enable('jsonp callback');

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser());
    app.use(methodOverride());


    app.use(express.static('public'));


    app.use(function(req, res, next) {
        var key =  req.headers['x-access-key'];
        var id=req.headers['x-access-id'];
        if(key && id){
            ClientOperations.authenticate(id, key, function(success, user){
                console.log("OAuth authen: "+success+" "+user);
                req.authenticated=success;
                if(success){
                    req.user=user;
                }
                next();
            });
        }else {
            next();
        }
    });


    app.get('/',function(req, res){
        //console.log("Req.user: "+req.user);
        fs.readFile('./public/medicalAssistant.html', function(err, html){
            if(err){
                throw err;
            }else{
                res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
                res.write(html);
                res.end();
            }
        });
    });


    //Error handler
    if (process.env.NODE_ENV === 'development') {
        app.use(errorHandler());
    }

    console.log('****************Medical Assistant is now live!****************');
};
