/**
 * Created by Jibin_ism on 08-Jan-16.
 */


var fs = require('fs');

var folders = ['doc/', 'naturals/'];
var docs = ['doc.jpg', 'pills.jpg'];
var naturals = ['fruits.jpg', 'ayurvedic.jpg', 'leaf_pills.jpg', 'pill_fruits.jpg'];
var folderFiles = [docs, naturals];

var sendPicture = function (uploadDirectory, filename, res) {
    //console.log("Sending image: "+filename);
    fs.readFile("./uploads/images/" + uploadDirectory + "/" + filename, function (err, file) {
        if (err) {

            var baseFolder = "./public/images/med/";
            var folderIndex = getRandomInt(folders);
            var categoryFolder = folders[folderIndex];
            var file2 = folderFiles[folderIndex][getRandomInt(folderFiles[folderIndex])];
            var filePath = baseFolder+categoryFolder+file2;
            //console.log("Sending file form path: "+filePath);
            fs.readFile(filePath, function (err, file) {
                if (err) {
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': file.length});
                    res.write(file);
                    res.end();
                }
            });
        } else {
            //console.log("Got image file: "+file.length);
            //console.log("File: "+file);
            res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': file.length});
            res.write(file);
            res.end();
        }
    });
};

function getRandomInt(array) {
    var max=array.length;
    return Math.floor(Math.random() * max);
}

var sendUserPic = function (req, res) {
    sendPicture('users', req.params.filename, res);
};

var sendRemedyPic = function (req, res) {
    sendPicture('remedy', req.params.filename, res);
};

exports.sendUserPic = sendUserPic;
exports.sendRemedyPic = sendRemedyPic;



