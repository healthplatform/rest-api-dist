"use strict";
var async = require('async');
var validators_1 = require('../../utils/validators');
var main_1 = require('../../main');
var errors_1 = require('../../utils/errors');
var utils_1 = require('./utils');
var middleware_1 = require('./middleware');
var middleware_2 = require('./../historic/middleware');
var middleware_3 = require('./../visit/middleware');
var middleware_4 = require('../auth/middleware');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace, validators_1.has_body, middleware_4.has_auth(), function (req, res, next) {
        utils_1.createPatient(req.body, function (error, results) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(201, results);
            return next();
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:medicare_no", middleware_4.has_auth(), middleware_1.fetchPatient, function (req, res, next) {
        res.json(req.patient);
        return next();
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace + "/:medicare_no", middleware_4.has_auth(), function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        Patient.destroy({ medicare_no: req.params.medicare_no }).exec(function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.send(204);
            return next();
        });
    });
}
exports.del = del;
function batchGet(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "s", middleware_4.has_auth(), function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        var q = Patient.find();
        if (req.params.populate_contact)
            q.populate('contact')
                .populate('gp')
                .populate('other_specialists');
        q.exec(function (error, patients) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json({ 'patients': patients });
            return next();
        });
    });
}
exports.batchGet = batchGet;
function batchCreate(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace + "s", validators_1.has_body, middleware_4.has_auth(), function (req, res, next) {
        async.mapLimit(req.body.patients, 1, utils_1.createPatient, function (error, results) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(201, { patients: results });
            return next();
        });
    });
}
exports.batchCreate = batchCreate;
function batchDelete(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace + "s", validators_1.has_body, middleware_4.has_auth(), function (req, res, next) {
        var Patient = main_1.collections['patient_tbl'];
        if (!req.body.patients)
            return next(new errors_1.NotFoundError('patients key on body'));
        Patient.destroy({ medicare_no: req.body.patients.map(function (v) { return v.medicare_no; }) }).exec(function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(204);
            return next();
        });
    });
}
exports.batchDelete = batchDelete;
function getAllPatientRelated(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:medicare_no/all", middleware_4.has_auth(), function (req, res, next) {
        async.parallel([
            function (cb) { return middleware_1.fetchPatient(req, res, cb); },
            function (cb) { return middleware_2.fetchHistoric(req, res, cb); },
            function (cb) { return middleware_3.fetchVisits(req, res, cb); }
        ], function () {
            res.json({
                visits: req.visits,
                historic: req.historic,
                patient: req.patient
            });
            return next();
        });
    });
}
exports.getAllPatientRelated = getAllPatientRelated;
