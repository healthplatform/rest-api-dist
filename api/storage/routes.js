"use strict";
var errors_1 = require('./../../utils/errors');
var validators_1 = require('./../../utils/validators');
var main_1 = require('./../../main');
var middleware_1 = require('../auth/middleware');
var fs_1 = require('fs');
var middleware_2 = require('./middleware');
function create(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.post(namespace + "/:uploader", validators_1.has_body, middleware_1.has_auth(), function (req, res, next) {
        var Storage = main_1.collections['storage_tbl'];
        Storage.create({
            uploader: req.params.uploader,
            size: req.files.file.size,
            local_location: req.files.file.path,
            name: req.params.uploader + "/" + req.files.file.name,
            mime_type: req.files.file.type,
            remote_location: namespace + "/" + req.params.uploader + "/" + req.files.file.name
        }).exec(function (error, storage) {
            if (error)
                return next(errors_1.fmtError(error));
            res.json(201, storage);
            return next();
        });
    });
}
exports.create = create;
function get(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:uploader/:filename", middleware_1.has_auth(), middleware_2.fetchStorage, function (req, res, next) {
        fs_1.readFile(req.storage.local_location, null, function (error, fileContents) {
            if (error)
                return next(errors_1.fmtError(error));
            if (!fileContents)
                return next(new errors_1.NotFoundError('fileContents'));
            res.contentType = req.storage.mime_type.slice(req.storage.mime_type.lastIndexOf('/') + 1);
            res.contentLength = req.storage.size;
            res.send(fileContents);
            return next();
        });
    });
}
exports.get = get;
function getMeta(app, namespace) {
    if (namespace === void 0) { namespace = ""; }
    app.get(namespace + "/:uploader/:filename/meta", middleware_1.has_auth(), middleware_2.fetchStorage, function (req, res, next) {
        res.json(req.storage);
        return next();
    });
}
exports.getMeta = getMeta;
