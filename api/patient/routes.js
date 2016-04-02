"use strict";
var async = require('async');
var validators_1 = require('../../utils/validators');
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
var errors_1 = require('../../utils/errors');
var utils_1 = require('./utils');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace, validators_1.has_body, function (req, res, next) {
        utils_1.createPatient(req.body, function (error, results) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(201, results);
            return next();
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:medicare_no", function (req, res, next) {
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
                return next(new errors_1.NotFoundError("patient with medicare_no '" + req.params.medicare_no + "'"));
            }
            res.json(patient.toJSON());
            return next();
        });
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace + "/:medicare_no", function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        console.log('req.params =', req.params);
        console.log('req.body =', req.body);
        req.log.info('req.params =', req.params);
        req.log.info('req.body =', req.body);
        Patient.destroy({ medicare_no: req.params.medicare_no }).exec(function (error) {
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
function batchGet(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "s", function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        Patient.find().exec(function (error, patients) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json({ 'patients': patients });
            return next();
        });
    });
}
exports.batchGet = batchGet;
function batchCreate(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace + "s", validators_1.has_body, function (req, res, next) {
        async.mapLimit(req.body.patients, 1, utils_1.createPatient, function (error, results) {
            if (error) {
                console.error(error);
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(201, { patients: results });
            return next();
        });
    });
}
exports.batchCreate = batchCreate;
function batchDelete(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace + "s", validators_1.has_body, function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        if (!req.body.patients)
            return next(new errors_1.NotFoundError('patients key on body'));
        req.log.info('req.body.patients =', req.body.patients);
        Patient.destroy({ medicare_no: req.body.patients.map(function (v) { return v.medicare_no; }) }).exec(function (error) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(204);
            return next();
        });
    });
}
exports.batchDelete = batchDelete;
