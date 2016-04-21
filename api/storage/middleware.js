"use strict";
var errors_1 = require('./../../utils/errors');
var main_1 = require('../../main');
function fetchStorage(req, res, next) {
    var Storage = main_1.collections['storage_tbl'];
    if (req.params.filename === undefined) {
        return next(new errors_1.NotFoundError('filename in url is undefined'));
    }
    Storage.findOne({
        uploader: req.params.uploader,
        name: req.params.uploader + "/" + req.params.filename
    }).exec(function (error, storage) {
        if (error)
            return next(errors_1.fmtError(error));
        else if (!storage)
            return next(new errors_1.NotFoundError('storage'));
        req.storage = storage;
        return next();
    });
}
exports.fetchStorage = fetchStorage;
