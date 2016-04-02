"use strict";
var restify_1 = require('restify');
var util_1 = require('util');
exports.to_end = function (res) {
    return {
        NotFound: function (entity) {
            if (entity === void 0) { entity = 'Entity'; }
            return res.json(404, {
                error: 'NotFound', error_message: entity + " not found"
            });
        }
    };
};
function NotFoundError(entity) {
    if (entity === void 0) { entity = 'Entity'; }
    this.name = 'NotFoundError';
    var msg = entity + " not found";
    restify_1.RestError.call(this, {
        restCode: this.name,
        statusCode: 404,
        message: msg,
        constructorOpt: NotFoundError,
        body: {
            error: this.name,
            error_message: msg
        }
    });
}
exports.NotFoundError = NotFoundError;
util_1.inherits(NotFoundError, restify_1.RestError);
function WaterlineError(wl_error, statusCode) {
    if (statusCode === void 0) { statusCode = 400; }
    this.name = 'WaterlineError';
    restify_1.RestError.call(this, {
        message: wl_error.reason,
        statusCode: statusCode,
        constructorOpt: WaterlineError,
        restCode: this.name,
        body: {
            error: wl_error.code,
            error_message: wl_error.reason,
            error_metadata: {
                details: wl_error.details.split('\n'),
                invalidAttributes: wl_error.invalidAttributes
            }
        }
    });
}
exports.WaterlineError = WaterlineError;
util_1.inherits(NotFoundError, restify_1.RestError);
