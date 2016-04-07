"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var visit_test_sdk_1 = require('./visit_test_sdk');
var patient_test_sdk_1 = require('./../patient/patient_test_sdk');
var visit_mocks_1 = require('./visit_mocks');
var patient_mocks_1 = require('../patient/patient_mocks');
var auth_test_sdk_1 = require('../auth/auth_test_sdk');
var models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient'],
    kv: main_1.all_models_and_routes['kv'],
    visit: main_1.all_models_and_routes['visit']
};
describe('Visit::routes', function () {
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.patient_mocks = new patient_mocks_1.PatientMocks();
        _this.mocks = visit_mocks_1.VisitMocks;
        _this.authSDK = new auth_test_sdk_1.AuthTestSDK(_this.app);
        async.series([
            function (cb) { return _this.authSDK.logout_unregister(undefined, function () { return cb(); }); },
            function (cb) { return _this.authSDK.register_login(undefined, cb); }
        ], function (err, responses) {
            if (err) {
                return done(err);
            }
            _this.token = responses[1];
            _this.sdk = new visit_test_sdk_1.VisitTestSDK(_this.app, _this.token);
            _this.patientSDK = new patient_test_sdk_1.PatientTestSDK(_this.app, _this.token);
            return done();
        });
    }); });
    after(function (done) {
        return async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
    });
    describe('/api/patient/{medicare_no}/visit', function () {
        beforeEach(function (done) {
            return _this.patientSDK.deregister(_this.patient_mocks.patients[0], function () {
                return _this.patientSDK.register(_this.patient_mocks.patients[0], done);
            });
        });
        afterEach(function (done) {
            return _this.sdk.deregister(_this.mocks[0], function (err) {
                return err && done(err) || _this.patientSDK.deregister(_this.patient_mocks.patients[0], done);
            });
        });
        it('POST should create Visit', function (done) {
            _this.sdk.register(_this.mocks[0], function (err, visit) {
                if (err)
                    return done(err);
                _this.mocks[0].createdAt = visit.createdAt;
                return done();
            });
        });
    });
    describe('[FAUX] /api/patient/{medicare_no}/visits', function () {
        beforeEach(function (done) {
            return _this.patientSDK.deregisterMany(_this.patient_mocks, function () {
                return _this.patientSDK.registerMany(_this.patient_mocks, done);
            });
        });
        afterEach(function (done) {
            return _this.sdk.deregisterManyFaux(_this.mocks, function (err) {
                return err && done(err) || _this.patientSDK.deregister(_this.patient_mocks.patients[0], done);
            });
        });
        it('POST should create many Visit', function (done) {
            _this.sdk.registerManyFaux(_this.mocks, function (err, visits) {
                if (err)
                    return done(err);
                for (var i = 0; i < visits.length; i++)
                    _this.mocks[i].createdAt = visits[i].createdAt;
                return done();
            });
        });
    });
});
