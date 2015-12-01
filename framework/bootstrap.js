'use strict'

var mongoose = require('mongoose');
var express = require('express');
var utils = require('./utils');

var moduleDir = './modules';

global.requireFromModule = utils.requireFromModule;
global.successJSON=utils.successJSON;
global.errorJSON=utils.errorJSON;

var connection;
console.log("Hello!!!");

module.exports = function(config) {
	global.app = express();
	require('./express')(app);

    //Connect to the database with given db url and options
	function connectDb() {
		mongoose.connect(config.db.uri, config.db.options);
	}

	connectDb();

	function bootstrapModels() {
        var dir = 'models';
        utils.walk(moduleDir, dir);
    }

    bootstrapModels();

    function bootstrapRoutes() {
        var dir = 'routes';
        utils.walk(moduleDir, dir);
    }

    bootstrapRoutes();

	return app;
};