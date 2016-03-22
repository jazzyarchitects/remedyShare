/**
 * Created by Jibin_ism on 06-Feb-16.
 */
var express = require('express');
var router = express.Router();
var control = requireFromModule('medicine/controllers');

router.use(function (req, res, next) {
    if (req.authenticated === false) {
        res.json(errorJSON(602, "AUTHENTICATION_ERROR", "USER_KEY_NOT_PROVIDED"));
    } else {
        next();
    }
});

router.post('/multiple', function (req, res) {
    control.createMultipleMedicines(req, res);
});

router.post('/', function (req, res) {
    control.createMedicine(req, res);
});

router.get('/', function(req, res){
   control.getAllMedicines(req, res);
});

router.get('/:id', function(req, res){
   control.getMedicine(req, res);
});

router.delete('/:id/finish', function(req, res){
   control.finishDosage(req, res);
});

printRoutes(router,'medicineRoutes.json');
module.exports = function (app) {
    app.use('/medicine', router);
};