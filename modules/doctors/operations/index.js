/**
 * Created by jibinmathews on 21/3/16.
 */

var _ = require('lodash');

module.exports = _.extend({
    Crud: requireFromModule('doctors/operations/crudOperations'),
    Medicines: requireFromModule('doctors/operations/medicineOperations'),
    Backup: requireFromModule('doctors/operations/backupOperations')
});