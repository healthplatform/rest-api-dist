"use strict";
var async = require('async');
var validators_1 = require('./../../utils/validators');
var main_1 = require('./../../main');
var helpers_1 = require('./../../utils/helpers');
var errors_1 = require('./../../utils/errors');
var middleware_1 = require('./../auth/middleware');
var models_1 = require('./../auth/models');
var user_schema = require('./../../test/api/user/schema');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace, validators_1.has_body, validators_1.mk_valid_body_mw(user_schema), function (req, res, next) {
        var User = main_1.collections['user_tbl'];
        User.create(req.body).exec(function (error, user) {
            if (error)
                return next(errors_1.fmtError(error));
            res.setHeader('X-Access-Token', models_1.AccessToken().add(req.body.email, 'login'));
            res.json(201, user);
            return next();
        });
    });
}
exports.create = create;
function read(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace, middleware_1.has_auth(), function (req, res, next) {
        var User = main_1.collections['user_tbl'];
        User.findOne({ email: req['user_id'] }, function (error, user) {
            if (error)
                return next(errors_1.fmtError(error));
            else if (!user)
                next(new errors_1.NotFoundError('User'));
            res.json(user);
            return next();
        });
    });
}
exports.read = read;
function update(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.put(namespace, validators_1.remove_from_body(['email']), validators_1.has_body, validators_1.mk_valid_body_mw(user_schema, false), validators_1.mk_valid_body_mw_ignore(user_schema, ['Missing required property']), middleware_1.has_auth(), function (req, res, next) {
        if (!helpers_1.isShallowSubset(req.body, user_schema.properties))
            return res.json(400, {
                error: 'ValidationError',
                error_message: 'Invalid keys detected in body'
            }) && next();
        else if (!req.body || !Object.keys(req.body).length)
            return res.json(400, { error: 'ValidationError', error_message: 'Body required' }) && next();
        var User = main_1.collections['user_tbl'];
        async.waterfall([
            function (cb) { return User.findOne({ email: req['user_id'] }, function (err, user) {
                if (err)
                    cb(err);
                else if (!user)
                    cb(new errors_1.NotFoundError('User'));
                return cb(err, user);
            }); },
            function (user, cb) {
                return User.update(user, req.body, function (e, r) { return cb(e, r[0]); });
            }
        ], function (error, result) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(200, result);
            return next();
        });
    });
}
exports.update = update;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace, middleware_1.has_auth(), function (req, res, next) {
        var User = main_1.collections['user_tbl'];
        async.waterfall([
            function (cb) { return models_1.AccessToken().logout({ user_id: req['user_id'] }, cb); },
            function (cb) { return User.destroy({ email: req['user_id'] }, cb); }
        ], function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.send(204);
            return next();
        });
    });
}
exports.del = del;
