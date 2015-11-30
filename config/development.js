/*
    Author : Akas Antony
    Date : 14/05/2015
*/

'use strict';
var path = require('path');

var rootPath = path.normalize(__dirname + '/..');

module.exports = {
    root: rootPath,
    db: {
        //uri: 'mongodb://localhost/remedyShare',
        uri: 'mongodb://jazzyarchitects:jazzy@architects@ds061354.mongolab.com:61354/heroku_mrwqgl13',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    server: {
        port: 3000
    },
    keys: {
		token: 'scribblerKey'
    },
	image: {
		cdnURL: 'https://upload.uploadcare.com/base/',
		imageBaseURL: 'https://ucarecdn.com/'
	},
    mailserver:{
        service: "Gmail",
        email: "scribblernotebooks@gmail.com",
        password: "scribbler@notebooks",
        sender: "hi@scribblernotebooks.com"
    }
};
