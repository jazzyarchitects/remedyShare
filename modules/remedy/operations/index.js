/**
 * Created by Jibin_ism on 28-Dec-15.
 */


var Crud = require('./crudOperations');
var Search = require('./searchOperations');
var Backup = require('./backupOperations');
var Stats = require('./statsOperations');

exports.insert = Crud.Insert;
exports.update = Crud.Update;
exports.removeRemedy = Crud.RemoveRemedy;
exports.getRemedy = Crud.GetRemedy;
exports.deactivateRemedy = Crud.DeactivateRemedy;
exports.getAllRemedies = Crud.GetAllRemedies;

exports.getUpVotes = Stats.GetUpVotes;
exports.getDownVotes = Stats.GetDownVotes;
exports.upvote = Stats.Upvote;
exports.downvote = Stats.Downvote;
exports.insertComment = Stats.InsertComment;
exports.deleteComment = Stats.DeleteComment;
exports.registerView = Stats.RegisterView;
exports.getCommentList = Stats.GetCommentList;
exports.bookmarkRemedy = Stats.BookmarkRemedy;

exports.search = Search.Search;
exports.findRemedyByDisease = Search.FindByDisease;

exports.importFromJSON = Backup.ImportFromJSON;
exports.exportForBackup = Backup.ExportForBackup;
exports.importBackup = Backup.ImportBackup;