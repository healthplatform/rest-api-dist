"use strict";
var main_1 = require('../../main');
var validators_1 = require('../../utils/validators');
var errors_1 = require('../../utils/errors');
function batchGet(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "s", function (req, res, next) {
        var Contact = main_1.collections['contact_tbl'];
        Contact.find().exec(function (error, contacts) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json({ 'contacts': contacts });
            return next();
        });
    });
}
exports.batchGet = batchGet;
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace, validators_1.has_body, function (req, res, next) {
        var Contact = main_1.collections['contact_tbl'];
        Contact.create(req.body).exec(function (error, contact) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(contact);
            return next();
        });
    });
}
exports.create = create;
