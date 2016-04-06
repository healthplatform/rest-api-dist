"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var historic_test_sdk_1 = require('./historic_test_sdk');
var patient_test_sdk_1 = require('./../patient/patient_test_sdk');
var patient_mocks_1 = require('./../patient/patient_mocks');
var historic_mocks_1 = require('./historic_mocks');
var auth_test_sdk_1 = require('../auth/auth_test_sdk');
var models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient'],
    historic: main_1.all_models_and_routes['historic']
};
describe('Historic::routes', function () {
    var self = _this;
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.sdk = historic_test_sdk_1.test_sdk(self.app);
        _this.patient_mocks = new patient_mocks_1.PatientMocks();
        _this.mocks = historic_mocks_1.HistoricMocks;
        _this.authSDK = new auth_test_sdk_1.AuthTestSDK(_this.app);
        console.info('about to call async.waterfall()');
        async.waterfall([
            function (cb) { return _this.authSDK.logout_unregister(undefined, function () { return cb(); }); },
            function (cb) { return _this.authSDK.register_login(undefined, cb); }
        ], function (err, token) {
            if (err) {
                return done(err);
            }
            _this.token = token;
            _this.patientSDK = new patient_test_sdk_1.PatientTestSDK(_this.app, _this.token);
            return done();
        });
    }); });
    after(function (done) {
        return self.connections && async.parallel(Object.keys(self.connections).map(function (connection) { return self.connections[connection]._adapter.teardown; }), done);
    });
    describe('/api/patient/{medicare_no}/historic', function () {
        beforeEach(function (done) {
            return async.series([
                function (cb) { return self.patient_sdk.deregister(self.patient_mocks.patients[0], function () { return cb(); }); },
                function (cb) { return self.patient_sdk.register(self.patient_mocks.patients[0], cb); }
            ], done);
        });
        afterEach(function (done) {
            return async.series([
                function (cb) { return self.sdk.deregister(self.mocks[0], cb); },
                function (cb) { return self.patient_sdk.deregister(self.patient_mocks.patients[0], cb); }
            ], done);
        });
        it('POST should create Historic', function (done) {
            self.sdk.register(self.mocks[0], done);
        });
    });
});
