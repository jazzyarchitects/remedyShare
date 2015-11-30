/*
    Author : Akas Antony
    Date : 14/05/2015
*/

'use strict';

var config = require('./framework/config');
var app = require('./framework/bootstrap')(config);


app.listen(config.server.port);

module.exports = app;