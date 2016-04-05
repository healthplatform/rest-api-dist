"use strict";
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
function fetchHistoric(req, res, next) {
    var PatientHistory = main_1.collections['patient_historic_tbl'];
    PatientHistory.findOne({ medicare_no: req.params.medicare_no }).exec(function (error, historic) {
        if (error) {
            var e = helpers_1.fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        req.historic = historic;
        return next();
    });
}
exports.fetchHistoric = fetchHistoric;
