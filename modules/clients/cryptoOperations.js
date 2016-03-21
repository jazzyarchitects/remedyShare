/**
 * Created by Jibin_ism on 11-Dec-15.
 */
var crypto = require('crypto');

var _hashFunction = function (pass, key, iterations, length, callback) {
    var salt = new Buffer(key).toString('hex');
    crypto.pbkdf2(pass, salt, iterations, length, function (err, hash) {
        var result = {};
        if (err) {
            result.success = false;
            result.error = err;
        } else {
            result.success = true;
            result.hash = (new Buffer(hash).toString('hex'));
        }
        callback(result);
    });
};

var hashPassword = function (user, key, callback) {
    _hashFunction(user.password, key, 9463, 300, callback);
};

var hashKey = function (uuid, callback) {
    _hashFunction(uuid, "ApiHash", 1, 20, callback);
};

exports.hash = hashPassword;
exports.hashKey = hashKey;