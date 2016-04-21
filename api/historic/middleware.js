"use strict";
var main_1 = require('../../main');
var errors_1 = require('./../../utils/errors');
function fetchHistoric(req, res, next) {
    var PatientHistory = main_1.collections['patient_historic_tbl'];
    PatientHistory.findOne({ medicare_no: req.params.medicare_no }).exec(function (error, historic) {
        if (error)
            return next(errors_1.fmtError(error));
        else if (!historic)
            return next(new errors_1.NotFoundError('historic'));
        req.historic = historic;
        return next();
    });
}
exports.fetchHistoric = fetchHistoric;
