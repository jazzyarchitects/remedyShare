'use strict';		
 var path = require('path');		
var serverConfig = require('./serverConfig');
 var rootPath = path.normalize(__dirname + '/..');		
 		
 module.exports = {		
     root: rootPath,		
     db: {		
          uri: serverConfig.db.host,
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
     services:['androidApp1958-2013JE0305', 'webApp1958-2013@ISM', 'RandomUsesKey-86452']		
 };
