"use strict";
var errors_1 = require('./../../utils/errors');
var validators_1 = require('./../../utils/validators');
var main_1 = require('./../../main');
var middleware_1 = require('./middleware');
var middleware_2 = require('../auth/middleware');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun, validators_1.has_body, middleware_2.has_auth(), function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        req.body.medicare_no = req.params.medicare_no;
        Visit.create(req.body).exec(function (error, visit) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(201, visit);
            return next();
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(namespace + "/patient/:medicare_no/" + noun + "/:createdAt", middleware_2.has_auth(), middleware_1.fetchVisit, function (req, res, next) {
        res.json(req.visit);
        return next();
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(namespace + "/patient/:medicare_no/" + noun + "/:createdAt", middleware_2.has_auth(), function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        Visit.destroy({ createdAt: req.params.createdAt }).exec(function (error) {
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
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(namespace + "/patient/:medicare_no/" + noun + "s", middleware_2.has_auth(), middleware_1.fetchVisits, function (req, res, next) {
        res.json({ 'visits': req.visits });
        return next();
    });
}
exports.batchGet = batchGet;
function batchCreate(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun + "s", validators_1.has_body, middleware_2.has_auth(), function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'], Patient = main_1.collections['patient_tbl'];
        if (!req.body.visits)
            return next(new errors_1.NotFoundError('visits key on body'));
        else if (req.body.visits.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        }).length !== 1) {
            res.json(400, {
                error: 'ValidationError',
                error_message: 'All medicare_no need to be equal to bulk create them'
            });
            return next();
        }
        Patient.count({ medicare_no: req.body.visits[0].medicare_no }, function (err, count) {
            return (err || !count) ? next(err || new errors_1.NotFoundError('patient'))
                : Visit.createEach(req.body.visits).exec(function (error, visits) {
                    if (error)
                        return next(errors_1.fmtError(error));
                    res.json({ 'visits': visits });
                    return next();
                });
        });
    });
}
exports.batchCreate = batchCreate;
function batchDelete(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(namespace + "/patient/:medicare_no/" + noun + "s", validators_1.has_body, middleware_2.has_auth(), function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        if (!req.body.visits)
            return next(new errors_1.NotFoundError('visits key on body'));
        else if (req.body.visits.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        }).length !== 1) {
            res.json(400, {
                error: 'ValidationError',
                error_message: 'All medicare_no need to be equal to bulk create them'
            });
            return next();
        }
        Visit.destroy({ medicare_no: req.body.visits.map(function (v) { return v.medicare_no; }) }).exec(function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(204);
            return next();
        });
    });
}
exports.batchDelete = batchDelete;
