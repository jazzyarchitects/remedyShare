/**
 * Created by Jibin_ism on 08-Feb-16.
 */
var _ = require('lodash');


module.exports = _.extend({
    Medicine: requireFromModule('medicine/operations/medicineOperations'),
    MedicineDetails: requireFromModule('medicine/operations/medicineDetailsOperations')
});