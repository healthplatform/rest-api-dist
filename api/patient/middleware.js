"use strict";
var restify_1 = require('restify');
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
function fetchPatient(req, res, next) {
    var Patient = main_1.collections['patient_tbl'];
    var q = Patient.findOne({ medicare_no: req.params.medicare_no });
    if (req.params.populate_contact)
        q.populate('contact')
            .populate('gp')
            .populate('other_specialists');
    q.exec(function (error, patient) {
        if (error) {
            var e = helpers_1.fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        else if (!patient) {
            return next(new restify_1.NotFoundError("patient with medicare_no '" + req.params.medicare_no + "'"));
        }
        req.patient = patient;
        return next();
    });
}
exports.fetchPatient = fetchPatient;
