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
var multer = require('multer');
var config = require('./config');
var fs = require('fs');
//var router=express.Router();
var user= requireFromModule('users/views');


module.exports = function (app) {

    // Prettify HTML
    app.locals.pretty = true;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(compression({
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // set .html as the default extension
    app.set('view engine', 'html');

    // Enable jsonp
    app.enable('jsonp callback');

    // The cookieParser should be above session
    app.use(cookieParser());



    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser());
    app.use(methodOverride());


    //app.use(multer({'dest': './uploads/Remedies/'}).single('picture'));
    app.use(express.static('public'));

    app.delete('/:secret', function (req, res) {
        if (req.authenticated) {
            if (String(req.params.secret) === "whatIsMySecret-IdontKnow") {
                console.log("Deleting database");
                mongoose.connection.db.dropDatabase();
                res.json({success: true, deleted: true});
            }
        }
    });

    //Error handler
    if (process.env.NODE_ENV === 'development') {
        app.use(errorHandler());
    }

    console.log('****************Medical Assistant is now live!****************');
};
