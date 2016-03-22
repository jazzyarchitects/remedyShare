/**
 * Created by Jibin_ism on 08-Feb-16.
 */
var _ = require('lodash');


module.exports = _.extend({
    Crud: requireFromModule('medicine/operations/crudOperations'),
    Doctors: requireFromModule('medicine/operations/doctorOperations'),
    Backup: requireFromModule('medicine/operations/backupOperations')
});