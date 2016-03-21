/**
 * Created by Jibin_ism on 25-Dec-15.
 */

var control = requireFromModule('admin/controller');
var fs = require('fs');

var exportDatabase = function (req, res) {
    control.exportDatabase(function (result) {
        //res.json(result);
        fs.writeFile('./tmp/backup.json', JSON.stringify(result), function (err) {
            if (err) {
                console.log("Error writing backup file: "+JSON.stringify(err));
                res.end();
            } else {
                console.log("Backup Successful");
                res.download('./tmp/backup.json', 'backup.json', function (err) {
                    if (err) {
                        console.log("Error sending file: "+err);
                    } else {
                        console.log("File sent to download");
                    }
                    res.end();
                });
            }
        });
    });
};

var importDatabase = function (req, res) {
    control.importDatabase(req.file, function (result) {
        res.json(result);
    });
};

exports.exportDatabase = exportDatabase;
exports.importDatabase = importDatabase;