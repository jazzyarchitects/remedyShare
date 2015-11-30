/*
    Author : Akas Antony
    Date : 03/06/2015
*/
'use strict'
var jwt    = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwt.verify(token, app.get('secretKey'), function(err, success) {
        if(!err) {
            return res.json({ success: false, message: 'AUTHENTICATION_FAILURE' });
            req.authenticated = true;
            next();
        }
    });
}