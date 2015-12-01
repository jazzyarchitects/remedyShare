/**
 * Created by Jibin_ism on 01-Dec-15.
 */
    'use strict';
var mongoose=require('mongoose');
var Comment=mongoose.model('Comment');


var insertComment = function(commentDetails, callback){
    if(mongoose.Types.ObjectId.isValid(commentDetails.author)){
        Comment.save(commentDetails, function(err, doc){
            if(doc){
                Comment.findOne({_id: doc._id}).populate('author',['name','age']).exec(function(err, doc){
                   if(doc){
                       callback(successJSON(doc));
                   }else{
                       callback(errorJSON(501, "ERROR_INSERTING"));
                   }
                });
            }else{
                callback(errorJSON(501, err));
            }
        });
    }else{
        callback(errorJSON(501, "INVALID_AUTHOR_ID_IN_COMMENT"));
    }
};

var del=function(commentDetails, callback){
    if(mongoose.Types.ObjectId.isValid(commentDetails._id)){
        Comment.remove({_id:commentDetails._id},function(err,doc){
           if(doc){
               callback(successJSON(doc));
           } else{
               callback(errorJSON(501, err));
           }
        });
    }else{
        callback(errorJSON(501, "INVALID_COMMENT_ID_FOR_DELETION"));
    }
};

exports.insert=insertComment;
exports.delete=del;