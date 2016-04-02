"use strict";
var restify_1 = require('restify');
var validators_1 = require('./../../utils/validators');
var main_1 = require('./../../main');
var helpers_1 = require('./../../utils/helpers');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun, validators_1.has_body, function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'], Patient = main_1.collections['patient_tbl'];
        req.body.medicare_no = req.params.medicare_no;
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
                Visit.create({
                    medicare_no: req.params.medicare_no,
                    iop_left_eye: 5
                }).exec(function (error, visit) {
                    if (error) {
                        var e = helpers_1.fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.json(201, visit);
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
    app.get(namespace + "/patient/:medicare_no/" + noun + "/:createdAt", function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        Visit.findOne({ createdAt: req.params.createdAt }).exec(function (error, visit) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(visit);
            return next();
        });
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(namespace + "/patient/:medicare_no/" + noun + "/:createdAt", function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        Visit.destroy({ createdAt: req.params.createdAt }).exec(function (error) {
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
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(namespace + "/patient/:medicare_no/" + noun + "s", function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        Visit.find({ medicare_no: req.params.medicare_no }).exec(function (error, visits) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json({ 'visits': visits });
            return next();
        });
    });
}
exports.batchGet = batchGet;
function batchCreate(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/" + noun + "s", validators_1.has_body, function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'], Patient = main_1.collections['patient_tbl'];
        if (!req.body.visits)
            return next(new restify_1.NotFoundError('visits key on body'));
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
            return (err || !count) ? next(err || new restify_1.NotFoundError('patient'))
                : Visit.createEach(req.body.visits).exec(function (error, visits) {
                    if (error) {
                        var e = helpers_1.fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
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
    app.del(namespace + "/patient/:medicare_no/" + noun + "s", validators_1.has_body, function (req, res, next) {
        var Visit = main_1.collections['visit_tbl'];
        if (!req.body.visits)
            return next(new restify_1.NotFoundError('visits key on body'));
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
