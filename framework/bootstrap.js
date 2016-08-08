'use strict';

var mongoose = require('mongoose');
var express = require('express');
var utils = require('./utils');
var fs = require('fs');
var path = require('path');

var moduleDir = './modules';

global.requireFromModule = utils.requireFromModule;
global.successJSON = utils.successJSON;
global.errorJSON = utils.errorJSON;
global.authenticateUser = utils.authenticateUser;
global.printRoutes = utils.printRoutes;
var ClientOperations = requireFromModule('clients/operations');

var connection;
console.log("Hello!!!");

module.exports = function (config) {
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

    function apiAuthentication(app) {
        app.use(function (req, res, next) {

            var ckey, cid;
            if (req.cookies) {
                try {
                    var userCookie = JSON.parse(req.cookies.user);
                    ckey = userCookie.key;
                    cid = userCookie.id;
                } catch (Err) {
                    ckey = null;
                    cid = null;
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
                res.json({
                    success: false,
                    error: 601,
                    message: "Service UnAuthorised. Please contact system admin at jazzyarchitects@gmail.com"
                });
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
        requireFromModule('doctors/route')(router);
        requireFromModule('dailyNews/route')(router);
        app.use('/api', router);

        if(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV){
            processRoutes();
        }
    }

    bootstrapRoutes();

    function processRoutes(dir) {
        var dirName = dir || './tmp/routes/';
        var string = "";
        fs.readdir(dirName, function (err, fileNames) {
            if (err) {
                fs.mkdirSync(dirName);
                return processRoutes(dir);
                console.log("Error in storing routes");
            } else {
                console.log("FileNames: " + JSON.stringify(fileNames));
                fileNames.forEach(function (fileName) {
                    fs.readFile(dirName + fileName, 'utf-8', function (err, content) {
                        console.log("Iterations: " + fileName + ' compare to ' + fileNames[fileNames.length - 1]);
                        if (fileName == fileNames[fileNames.length - 1]) {
                            string += '{"' + fileName + '":' + content + '}';
                            fs.writeFileSync('./tmp/routesRaw.json', '{"routes":[' + string + ']}', 'utf-8');
                            extractRoutes();
                        } else {
                            string += '{"' + fileName + '":' + content + '},';
                        }
                    });
                });
            }
        });
    }

    function extractRoutes() {
        fs.readFile('./tmp/routesRaw.json', function (err, string) {
            var file = JSON.parse(string);
            var content = file.routes;

            var html = "<!DOCTYPE html><html lang=\"en\"><head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Routes</title>" +
                "</head>" +
                "<body><div style=\"border: 1px #000 solid; width: 60%; margin: auto; padding: 5px;\">" +
                "<table width='100%'>" +
                "<tr>" +
                "<th>Prefix</th>" +
                "<th>Path</th>" +
                "<th>Methods</th>" +
                "</tr>";

            content.forEach(function (jsonObject) {
                var key = Object.keys(jsonObject)[0];
                var innerArray = jsonObject[key];
                html += '<tr><td colspan="3">&nbsp;<hr /></td></tr><tr style="border: #000000 2px solid;"><td>/' + key.replace('Routes.json','').replace("-","/") + '</td></tr>';
                innerArray.forEach(function (jObj) {
                    if (jObj.route) {
                        var route = jObj.route;
                        var path = route.path;
                        var stack = route.stack;
                        html+='<tr><td></td><td>'+path+'</td>';
                        var methods = [];
                        stack.forEach(function (stackObject) {
                            if (stackObject.name == "<anonymous>") {
                                methods.push(stackObject.method);
                            }
                        });
                        html += '<td>'+methods+'</td></tr>';
                    }
                });
            });

            html += '</table></div></body></html>';
            fs.writeFileSync('./tmp/routes.html',html);

        });
    }

    function createLogFolder(){
        if(!fs.existsSync('./logFiles')){
            fs.mkdirSync('./logFiles');
        }
    }

    createLogFolder();


    return app;
};
