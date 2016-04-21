"use strict";
var main_1 = require('../../main');
var validators_1 = require('./../../utils/validators');
var errors_1 = require('../../utils/errors');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace, validators_1.has_body, function (req, res, next) {
        var KV = main_1.collections['kv_tbl'];
        KV.create(req.body).exec(function (error, kv) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(201, kv);
            return next();
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:key", function (req, res, next) {
        var KV = main_1.collections['kv_tbl'];
        KV.findOne({ key: req.params.key }).exec(function (error, kv) {
            if (error)
                return next(errors_1.fmtError(error));
            else if (!kv)
                return next(new errors_1.NotFoundError('kv'));
            res.json(kv);
            return next();
        });
    });
}
exports.get = get;
function del(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.del(namespace + "/:key", function (req, res, next) {
        var KV = main_1.collections['kv_tbl'];
        KV.destroy({ key: req.params.key }).exec(function (error) {
            if (error)
                return next(errors_1.fmtError(error));
            res.send(204);
            return next();
        });
    });
}
exports.del = del;
