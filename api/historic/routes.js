"use strict";
var errors_1 = require('./../../utils/errors');
var main_1 = require('../../main');
var validators_1 = require('./../../utils/validators');
var middleware_1 = require('./middleware');
var middleware_2 = require('../auth/middleware');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun, validators_1.has_body, middleware_2.has_auth(), function (req, res, next) {
        var PatientHistory = main_1.collections['patient_historic_tbl'], Patient = main_1.collections['patient_tbl'];
        Patient.count({ medicare_no: req.body.medicare_no }, function (error, count) {
            if (error)
                return next(errors_1.fmtError(error));
            if (!count) {
                return next(new errors_1.NotFoundError('patient'));
            }
            else {
                PatientHistory.create(req.body).exec(function (err, historic) {
                    if (err)
                        return next(errors_1.fmtError(err));
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
    app.get(namespace + "/patient/:medicare_no/" + noun, middleware_2.has_auth(), middleware_1.fetchHistoric, function (req, res, next) {
        res.json(req.historic);
        return next();
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(namespace + "/patient/:medicare_no/" + noun, middleware_2.has_auth(), function (req, res, next) {
        var PatientHistory = main_1.collections['patient_historic_tbl'];
        PatientHistory.destroy({ medicare_no: req.params.medicare_no }).exec(function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.send(204);
            return next();
        });
    });
}
exports.del = del;
