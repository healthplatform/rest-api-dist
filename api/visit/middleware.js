"use strict";
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
function fetchVisit(req, res, next) {
    var Visit = main_1.collections['visit_tbl'];
    Visit.findOne({ createdAt: req.params.createdAt }).exec(function (error, visit) {
        if (error) {
            var e = helpers_1.fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        req.visit = visit;
        return next();
    });
}
exports.fetchVisit = fetchVisit;
function fetchVisits(req, res, next) {
    var Visit = main_1.collections['visit_tbl'];
    Visit.find({ medicare_no: req.params.medicare_no }).exec(function (error, visits) {
        if (error) {
            var e = helpers_1.fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        req.visits = visits;
        return next();
    });
}
exports.fetchVisits = fetchVisits;
