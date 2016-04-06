"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var patient_test_sdk_1 = require('./patient_test_sdk');
var patient_mocks_1 = require('./patient_mocks');
var auth_test_sdk_1 = require('./../auth/auth_test_sdk');
var models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient']
};
describe('Patient::routes', function () {
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.mocks = new patient_mocks_1.PatientMocks();
        _this.authSDK = new auth_test_sdk_1.AuthTestSDK(_this.app);
        async.waterfall([
            function (cb) { return _this.authSDK.logout_unregister(undefined, function () { return cb(); }); },
            function (cb) { return _this.authSDK.register_login(undefined, cb); }
        ], function (err, token) {
            if (err) {
                return done(err);
            }
            _this.token = token;
            _this.sdk = new patient_test_sdk_1.PatientTestSDK(_this.app, _this.token);
            return done();
        });
    }); });
    after(function (done) {
        return async.waterfall([
            function (cb) { return _this.authSDK.logout_unregister(undefined, cb); },
            function (cb) { return async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), cb); }
        ], done);
    });
    describe('/api/patient', function () {
        beforeEach(function (done) {
            return _this.sdk.deregister(_this.mocks.patients[0], done);
        });
        afterEach(function (done) {
            return _this.sdk.deregister(_this.mocks.patients[0], done);
        });
        it('POST should create Patient', function (done) {
            _this.sdk.register(_this.mocks.patients[0], done);
        });
    });
    describe('/api/patients', function () {
        beforeEach(function (done) {
            return _this.sdk.deregisterMany(_this.mocks, done);
        });
        afterEach(function (done) {
            return _this.sdk.deregisterMany(_this.mocks, done);
        });
        it('POST should create many Patient', function (done) {
            _this.sdk.registerMany(_this.mocks, done);
        });
    });
});
