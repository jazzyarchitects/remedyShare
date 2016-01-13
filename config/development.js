'use strict';		
 var path = require('path');		
 		
 ar rootPath = path.normalize(__dirname + '/..');		
 		
 module.exports = {		
     root: rootPath,		
     db: {		
          // uri: 'mongodb://127.0.0.1/remedyShare',		
         uri: 'mongodb://jibin19596:jazzy_architects@ds061354.mongolab.com:61354/heroku_mrwqgl13',		
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
     services:['androidApp1958-2013JE0305', 'webApp1958-2013@ISM']		
 };