"use strict";
var async = require('async');
var http_1 = require('http');
var url = require('url');
var patient_mocks_1 = require('../test/api/patient/patient_mocks');
var historic_mocks_1 = require('../test/api/historic/historic_mocks');
var visit_mocks_1 = require('../test/api/visit/visit_mocks');
var helpers_1 = require('./helpers');
function httpF(method) {
    return function (options, func_name, body_or_cb, cb) {
        if (!cb) {
            cb = body_or_cb;
            body_or_cb = null;
        }
        options['method'] = method;
        if (body_or_cb)
            if (!options)
                options = { 'headers': { 'Content-Length': Buffer.byteLength(body_or_cb) } };
            else if (!options.headers)
                options.headers = { 'Content-Length': Buffer.byteLength(body_or_cb) };
            else if (!options.headers['Content-Length'])
                options.headers['Content-Length'] = Buffer.byteLength(body_or_cb);
        var req = http_1.request(options, function (res) {
            res.func_name = func_name;
            if (!res)
                return cb(res);
            else if ((res.statusCode / 100 | 0) > 3)
                return cb(res);
            return cb(null, res);
        });
        body_or_cb && req.write(body_or_cb);
        req.end();
        return req;
    };
}
var httpHEAD = httpF('HEAD'), httpGET = httpF('GET'), httpPOST = httpF('POST'), httpPUT = httpF('PUT'), httpPATCH = httpF('PATCH'), httpDELETE = httpF('DELETE');
var SampleData = (function () {
    function SampleData(uri) {
        this.patientMocks = new patient_mocks_1.PatientMocks();
        this.historicMocks = historic_mocks_1.HistoricMocks;
        this.visitMocks = visit_mocks_1.VisitMocks;
        this.uri = url.parse(uri);
    }
    SampleData.prototype.mergeOptions = function (options, body) {
        return helpers_1.trivial_merge({
            host: this.uri.host === "[::]:" + this.uri.port ? 'localhost' :
                "" + this.uri.host.substr(this.uri.host.lastIndexOf(this.uri.port) + this.uri.port.length),
            port: parseInt(this.uri.port),
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body ? Buffer.byteLength(body) : 0
            }
        }, options);
    };
    SampleData.prototype.deletePatientsHttp = function (cb) {
        var body = JSON.stringify({ patients: this.patientMocks.patients });
        return httpDELETE(this.mergeOptions({ path: '/api/patients' }), 'deletePatientsHttp', body, cb);
    };
    SampleData.prototype.loadPatientsHttp = function (cb) {
        var body = JSON.stringify({ patients: this.patientMocks.patients });
        return httpPOST(this.mergeOptions({ path: '/api/patients' }), 'loadPatientsHttp', body, cb);
    };
    SampleData.prototype.deleteHistoricHttp = function (cb) {
        var _this = this;
        return async.map(this.historicMocks, function (historic, callback) { return httpDELETE(_this.mergeOptions({ path: "/api/patient/" + historic.medicare_no + "/historic" }), 'deleteHistoricHttp', callback); }, cb);
    };
    SampleData.prototype.loadHistoricHttp = function (cb) {
        var _this = this;
        return async.map(this.historicMocks, function (historic, callback) { return httpPOST(_this.mergeOptions({ path: "/api/patient/" + historic.medicare_no + "/historic" }), 'loadHistoricHttp', JSON.stringify(historic), callback); }, cb);
    };
    SampleData.prototype.loadVisitsHttp = function (cb) {
        var _this = this;
        return async.map(this.visitMocks, function (visit, callback) { return httpPOST(_this.mergeOptions({ path: "/api/patient/" + visit.medicare_no + "/visit" }), 'loadVisitsHttp', JSON.stringify(visit), callback); }, cb);
    };
    return SampleData;
}());
exports.SampleData = SampleData;
