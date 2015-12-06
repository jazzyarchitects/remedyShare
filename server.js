
'use strict';

var config = require('./framework/config');
var app = require('./framework/bootstrap')(config);


app.listen(config.server.port);

module.exports = app;