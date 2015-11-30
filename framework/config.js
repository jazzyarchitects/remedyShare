/*
    Author : Akas Antony
    Date : 14/05/2015
*/

'use strict'

var _ = require('lodash'),
    fs = require('fs');

//Specifying the path for mmongodb and image from cdn
module.exports = _.extend (
	require('../config/development')
);