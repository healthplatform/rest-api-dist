"use strict";
var restify_1 = require('restify');
var main_1 = require('../../main');
var validators_1 = require('./../../utils/validators');
var helpers_1 = require('../../utils/helpers');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun, validators_1.has_body, function (req, res, next) {
        var PatientHistory = main_1.collections['patient_historic_tbl'], Patient = main_1.collections['patient_tbl'];
        Patient.count({ medicare_no: req.body.medicare_no }, function (err, count) {
            if (err) {
                var e = helpers_1.fmtError(err);
                res.send(e.statusCode, e.body);
                return next();
            }
            else if (!count) {
                return next(new restify_1.NotFoundError('patient'));
            }
            else {
                PatientHistory.create(req.body).exec(function (error, historic) {
                    if (error) {
                        var e = helpers_1.fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.json(201, historic);
                    return next();
                });
            }
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(namespace + "/patient/:medicare_no/" + noun, function (req, res, next) {
        var PatientHistory = main_1.collections['patient_historic_tbl'];
        PatientHistory.findOne({ medicare_no: req.params.medicare_no }).exec(function (error, historic) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(historic);
            return next();
        });
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(namespace + "/patient/:medicare_no/" + noun, function (req, res, next) {
        var PatientHistory = main_1.collections['patient_historic_tbl'];
        PatientHistory.destroy({ medicare_no: req.params.medicare_no }).exec(function (error) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.send(204);
            return next();
        });
    });
}
exports.del = del;
