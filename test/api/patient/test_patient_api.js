"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var patient_test_sdk_1 = require('./patient_test_sdk');
var patient_mocks_1 = require('./patient_mocks');
var models_and_routes = {
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient']
};
describe('Patient::routes', function () {
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.sdk = patient_test_sdk_1.test_sdk(_this.app);
        _this.mocks = new patient_mocks_1.PatientMocks();
        done();
    }); });
    after(function (done) {
        return async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
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
            return _this.sdk.deregisterManyFaux(_this.mocks, done);
        });
        afterEach(function (done) {
            return _this.sdk.deregisterManyFaux(_this.mocks, done);
        });
        it('POST should create many Patient', function (done) {
            _this.sdk.registerManyFaux(_this.mocks, done);
        });
    });
});
