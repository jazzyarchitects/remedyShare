'use strict';
var path = require('path');

var rootPath = path.normalize(__dirname + '/..');

module.exports = {
    root: rootPath,
    db: {
        //uri: 'mongodb://127.0.0.1/remedyShare',
        uri: ' mongodb://jazzyarchitects:jazzy@architects@ds061354.mongolab.com:61354/heroku_mrwqgl13',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    server: {
        port: Number(process.env.PORT || 3000)
    },
    keys: {
		token: 'jazziness'
    },
	image: {
		cdnURL: 'https://upload.uploadcare.com/base/',
		imageBaseURL: 'https://ucarecdn.com/'
	},
    mailserver:{
        service: "Gmail",
        email: "jazzyarchitects@gmail.com",
        password: "jazzy@architects",
        sender: "hi@jazzyarchitects.com"
    }
};
