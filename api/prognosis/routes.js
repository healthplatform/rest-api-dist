"use strict";
var validators_1 = require('./../../utils/validators');
var middleware_1 = require('../auth/middleware');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/:visit_created_at/" + noun, validators_1.has_body, middleware_1.has_auth(), function (req, res, next) {
        res.send(501);
        return next();
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    var noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(namespace + "/patient/:medicare_no/:visit_created_at/" + noun, validators_1.has_body, middleware_1.has_auth(), function (req, res, next) {
        res.send(501);
        return next();
    });
}
exports.get = get;
