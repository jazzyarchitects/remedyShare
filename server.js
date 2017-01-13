
'use strict';

var config = require('./framework/config');
var app = require('./framework/bootstrap')(config);
//var http = require('http');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';

let ipAddr = 'localhost';
if(process.env.NODE_ENV==="production"){
  ipAddr = '172.31.32.223';
}


app.listen(server_port, ipAddr,  function () {
  console.log( "Listening on port " + server_port );
});

//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// app.listen(config.server.port);

//http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
//    console.log(" Express server listening at %s:%d ", app.get('ip'),app.get('port'));
//    server();
//});

module.exports = app;
