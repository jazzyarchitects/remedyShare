/**
 * Created by Jibin_ism on 25-Dec-15.
 */
var express = require('express');
var router = express.Router();
var admin = requireFromModule('admin/views');
var multer=require('multer');

//TODO: Make these routes accessible only to user

//router.put('/json/backup', )
var storage = multer.diskStorage({
    destination: './uploads/backupRestore/',
    filename: function(req, file, cb){
        cb(null, (new Date()).getTime().toString());
    }
});
var uploads=multer({storage: storage}).single('import');

router.post('/import/', uploads, function (req, res) {
    admin.importDatabase(req, res);
});

router.get('/export', function(req, res){
   admin.exportDatabase(req, res);
});

router.get('/errorLog', function(req, res){

});


printRoutes(router, 'adminRoutes.json');

module.exports = function (app) {
    app.use('/admin', router);
};