/**
 * Created by Jibin_ism on 27-Jan-16.
 */
var Crud = requireFromModule('users/operations/crudOperations');


exports.signUp = Crud.signUp;
exports.loginWithEmail = Crud.loginWithEmail;
exports.loginWithMobile = Crud.loginWithMobile;
exports.updateUser = Crud.updateUser;
exports.delete = Crud.delete;
exports.loginSocial = Crud.loginSocial;


var Remedy = requireFromModule('users/operations/remedyOperations');

exports.linkRemedy = Remedy.linkRemedy;
exports.getRemedyList = Remedy.getRemedyList;
exports.unlinkRemedy = Remedy.unlinkRemedy;
exports.upvoteRemedy = Remedy.upvoteRemedy;
exports.downvoteRemedy = Remedy.downvoteRemedy;


var Operations = requireFromModule('users/operations/operations');

exports.getUserData = Operations.getUserData;
exports.addComment = Operations.addComment;
exports.deleteComment = Operations.deleteComment;
exports.linkProfilePicture = Operations.linkProfilePicture;

var Backup = requireFromModule('users/operations/backupOperations');

exports.exportForBackup = Backup.exportForBackup;
exports.importBackup = Backup.importBackup;