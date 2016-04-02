"use strict";
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
var validators_1 = require('../../utils/validators');
function batchGet(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "s", function (req, res, next) {
        var Contact = main_1.collections['contact_tbl'];
        Contact.find().exec(function (error, contacts) {
            if (error) {
                var e = helpers_1.fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
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
        Contact.create(req.body).exec(function (err, contact) {
            if (err) {
                var e = helpers_1.fmtError(err);
                res.send(e.statusCode, e.body);
                return next();
            }
            res.json(contact);
            return next();
        });
    });
}
exports.create = create;
