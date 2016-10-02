"use strict";
var express = require('express');
var router = express.Router();
var Email = require('./model');
var fs = require('fs');

router.get('/stylesheet', function(req, res){
  // res.sendFile('./email-stylesheet.css');
  var id = req.params.id;
  if(id){
    if(!mongoose.Types.ObjectId.isValid(id)){
        try {
          id = mongoose.Types.ObjectId(user_id);
        }catch (e){
          return reject(errorJSON(500, e));
        }
      }
    Email.findOne({_id: id}, function(err, email){
      email.markRead();
    });
  }
});
