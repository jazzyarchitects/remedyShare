/*
    Author : Akas Antony
    Date : 14/05/2015
*/

'use strict'

var mongoose = require('mongoose');
var express = require('express');
var utils = require('./utils');

var moduleDir = './modules';

global.requireFromModule = utils.requireFromModule;
global.successJSON=utils.successJSON;
global.errorJSON=utils.errorJSON;
global.authenticateUser = utils.authenticateUser;
var ClientOperations = requireFromModule('clients/operations');

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

	//function bootstrapModels() {
     //   var dir = 'models';
     //   utils.walk(moduleDir, dir);
    //}
    //
    //bootstrapModels();
    //

	function apiAuthentication(app){
		app.use(function (req, res, next) {

			var ckey, cid;
			if(req.cookies){
				try {
					var userCookie = JSON.parse(req.cookies.user);
					ckey = userCookie.key;
					cid = userCookie.id;
				}catch (Err){
					ckey=null;
					cid=null;
				}
			}

			var key = req.headers['x-access-key'] || ckey;
			var id = req.headers['x-access-id'] || cid;
			var serviceToken = req.headers['x-service-id'];

			//console.log("Service id: " + serviceToken);
			if (serviceToken && config.services.indexOf(serviceToken) != -1) {
				req.service = serviceToken;
				if (key && id) {
					ClientOperations.authenticate(id, key, function (success, doc) {
						req.authenticated = success;
						if (success) {
							req.user = doc.user;
							req.admin = doc.admin;
						}
						next();
					});
				} else {
					next();
				}
			}
			else {
				/**UnComment the following before deployment TODO:*/
				res.json({
					success: false,
					error: 601,
					message: "Service UnAuthorised. Please contact system admin at jazzyarchitects@gmail.com"
				});
				//req.service="unauthorised";
				//next();
			}
		});
	}


    function bootstrapRoutes() {
		var router = express.Router();
		requireFromModule('web/route')(app);
		requireFromModule('images/route')(app);

		apiAuthentication(app);

		requireFromModule('users/route')(router);
		requireFromModule('remedy/route')(router);
		requireFromModule('comments/route')(router);
		requireFromModule('admin/route')(router);
		requireFromModule('medicine/route')(router);
		app.use('/api', router);
    }

    bootstrapRoutes();

	return app;
};