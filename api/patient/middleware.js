"use strict";
var errors_1 = require('./../../utils/errors');
var main_1 = require('../../main');
function fetchPatient(req, res, next) {
    var Patient = main_1.collections['patient_tbl'];
    var q = Patient.findOne({ medicare_no: req.params.medicare_no });
    if (req.params.populate_contact)
        q.populate('contact')
            .populate('gp')
            .populate('other_specialists');
    q.exec(function (error, patient) {
        if (error)
            return next(errors_1.fmtError(error));
        else if (!patient)
            return next(new errors_1.NotFoundError("patient with medicare_no '" + req.params.medicare_no + "'"));
        req.patient = patient;
        return next();
    });
}
exports.fetchPatient = fetchPatient;
