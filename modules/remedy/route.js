/**
 * Created by Jibin_ism on 26-Nov-15.
 */
var Remedy = requireFromModule('remedy/views');
var express = require('express');
var router = express.Router();
var multer = require('multer');

var uploadImage = multer({
    'dest': './uploads/images/remedy/'
}).single('image');

//router.use(uploadImage);

router.get('/all', function (req, res) {
    Remedy.getAll(req, res);
});
router.get('/all/:page', function (req, res) {
    Remedy.getAll(req, res);
});

/**
 * Checked
 */
router.get('/:id', function (req, res) {
    Remedy.get(req, res);
});

router.get('/:id/comments', function (req, res) {
    Remedy.getCommentList(req, res);
});

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});

/**
 * Checked
 */
router.post('/', uploadImage, function (req, res) {
    Remedy.insert(req, res);
});

/**
 * Checked
 */
router.put('/:id', uploadImage, function (req, res) {
    Remedy.update(req, res);
});


/**
 * Checked
 */
router.delete('/:id', function (req, res) {
    Remedy.delete(req, res);
});

/**
 * Checked
 */
router.put('/:id/upvote', function (req, res) {
    Remedy.upvote(req, res);
});

/**
 * Checked
 */
router.put('/:id/downvote', function (req, res) {
    Remedy.downvote(req, res);
});

router.put('/:id/bookmark', function (req, res) {
    Remedy.bookmarkRemedy(req, res);
});

/**
 * Checked
 */
router.post('/:id/comment', function (req, res) {
    Remedy.insertComment(req, res);
});

/**
 * Checked
 */
router.get('/diseases/:disease', function (req, res) {
    Remedy.findByDisease(req, res);
});


/**
 * Checked
 */
router.get('/diseases/:disease/:page', function (req, res) {
    Remedy.findByDisease(req, res);
});

/**
 * Checked
 */
router.get('/search/:query', function (req, res) {
    Remedy.searchRemedy(req, res);
});

/**
 * Checked
 */
router.get('/search/:query/:page', function (req, res) {
    Remedy.searchRemedy(req, res);
});

router.put('/viewed/:id', function (req, res) {
    Remedy.registerView(req, res);
});

router.post('/import', multer({'dest': './uploads/backups/'}).single('backup'), function (req, res) {
    Remedy.importFromJSON(req, res);
});


module.exports = function (app) {
    app.use('/remedy', router);
};