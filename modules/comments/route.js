/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var comments = requireFromModule('comments/views');
var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});

router.delete('/:id', function (req, res) {
    comments.deleteComment(req, res);
});

module.exports = function (app) {
    app.use('/comment', router);
};