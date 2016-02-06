/**
 * Created by Jibin_ism on 06-Feb-16.
 */
var express = require('express');
var router = express.Router();
var control = requireFromModule('medicine/controllers');

router.post('/', function (req, res) {
    control.createMedicine(req, res);
});


module.exports = function (app) {
    app.use('/medicine', router);
};