/**
 * Created by Jibin_ism on 17-Dec-15.
 */

var control = requireFromModule('comments/controller');

var deleteComment = function (req, res) {
    control.deleteComment(req.user, req.params.id, function (result) {
        res.json(result);
    });
};

exports.deleteComment = deleteComment;