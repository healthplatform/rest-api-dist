"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var historic_test_sdk_1 = require('./historic_test_sdk');
var patient_test_sdk_1 = require('./../patient/patient_test_sdk');
var patient_mocks_1 = require('./../patient/patient_mocks');
var historic_mocks_1 = require('./historic_mocks');
var models_and_routes = {
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient'],
    historic: main_1.all_models_and_routes['historic']
};
describe('Historic::routes', function () {
    var self = _this;
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        self.connections = connections;
        self.app = app;
        self.sdk = historic_test_sdk_1.test_sdk(self.app);
        self.patient_sdk = patient_test_sdk_1.test_sdk(self.app);
        self.patient_mocks = new patient_mocks_1.PatientMocks();
        self.mocks = historic_mocks_1.HistoricMocks;
        done();
    }); });
    after(function (done) {
        return async.parallel(Object.keys(self.connections).map(function (connection) { return self.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
    });
    describe('/api/patient/{medicare_no}/historic', function () {
        beforeEach(function (done) {
            return self.patient_sdk.deregister(self.patient_mocks.patients[0], function () {
                return self.patient_sdk.register(self.patient_mocks.patients[0], done);
            });
        });
        afterEach(function (done) {
            return self.sdk.deregister(self.mocks[0], function (err) {
                return err && done(err) || self.patient_sdk.deregister(self.patient_mocks.patients[0], done);
            });
        });
        it('POST should create Historic', function (done) {
            self.sdk.register(self.mocks[0], done);
        });
    });
});
