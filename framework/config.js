'use strict'

var _ = require('lodash'),
    fs = require('fs');

//Specifying the path for mongodb and image from cdn
module.exports = _.extend (
	require('../config/development')
);