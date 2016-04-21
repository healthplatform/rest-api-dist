"use strict";
var main_1 = require('../../main');
var errors_1 = require('../../utils/errors');
function fetchVisit(req, res, next) {
    var Visit = main_1.collections['visit_tbl'];
    Visit.findOne({ createdAt: req.params.createdAt }).exec(function (error, visit) {
        if (error)
            return next(errors_1.fmtError(error));
        else if (!visit)
            return next(new errors_1.NotFoundError('visit'));
        req.visit = visit;
        return next();
    });
}
exports.fetchVisit = fetchVisit;
function fetchVisits(req, res, next) {
    var Visit = main_1.collections['visit_tbl'];
    Visit.find({ medicare_no: req.params.medicare_no }).exec(function (error, visits) {
        if (error)
            return next(errors_1.fmtError(error));
        req.visits = visits;
        return next();
    });
}
exports.fetchVisits = fetchVisits;
