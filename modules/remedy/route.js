/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var Remedy = requireFromModule('remedy/views');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    //TODO: Send default feed screen
});


router.get('/:id', function (req, res) {
    Remedy.get(req, res);
});

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});

router.post('/', function (req, res) {
    Remedy.insert(req, res);
});


router.put('/:id', function (req, res) {
    Remedy.update(req, res);
});

router.delete('/:id', function (req, res) {
    Remedy.delete(req, res);
});

router.put('/upvote/:id', function (req, res) {
    Remedy.upvote(req, res);
});

router.put('/downvote/:id', function (req, res) {
    Remedy.downvote(req, res);
});

router.post('/:id/comment', function (req, res) {
    Remedy.insertComment(req, res);
});


module.exports = function (app) {
    app.use('/remedy', router);
};