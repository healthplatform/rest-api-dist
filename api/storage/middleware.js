"use strict";
var restify_1 = require('restify');
var main_1 = require('../../main');
var helpers_1 = require('../../utils/helpers');
function fetchStorage(req, res, next) {
    var Storage = main_1.collections['storage_tbl'];
    if (req.params.filename === undefined) {
        return next(new restify_1.NotFoundError('filename in url is undefined'));
    }
    Storage.findOne({
        uploader: req.params.uploader,
        name: req.params.uploader + "/" + req.params.filename
    }).exec(function (error, storage) {
        if (error) {
            var e = helpers_1.fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        else if (!storage) {
            return next(new restify_1.NotFoundError('storage'));
        }
        req.storage = storage;
        return next();
    });
}
exports.fetchStorage = fetchStorage;
