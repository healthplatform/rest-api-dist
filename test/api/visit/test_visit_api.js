"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var visit_test_sdk_1 = require('./visit_test_sdk');
var patient_test_sdk_1 = require('./../patient/patient_test_sdk');
var visit_mocks_1 = require('./visit_mocks');
var patient_mocks_1 = require('../patient/patient_mocks');
var models_and_routes = {
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient'],
    kv: main_1.all_models_and_routes['kv'],
    visit: main_1.all_models_and_routes['visit']
};
describe('Visit::routes', function () {
    var self = _this;
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        self.connections = connections;
        self.app = app;
        self.sdk = new visit_test_sdk_1.VisitTestSDK(self.app);
        self.patient_mocks = new patient_mocks_1.PatientMocks();
        self.mocks = visit_mocks_1.VisitMocks;
        async.waterfall([
            function (cb) { return _this.authSDK.logout_unregister(undefined, function () { return cb(); }); },
            function (cb) { return _this.authSDK.register_login(undefined, cb); }
        ], function (err, token) {
            if (err) {
                return done(err);
            }
            self.token = token;
            self.patientSDK = new patient_test_sdk_1.PatientTestSDK(self.app, self.token);
            return done();
        });
        done();
    }); });
    after(function (done) {
        return async.parallel(Object.keys(self.connections).map(function (connection) { return self.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
    });
    describe('/api/patient/{medicare_no}/visit', function () {
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
        it('POST should create Visit', function (done) {
            self.sdk.register(self.mocks[0], function (err, visit) {
                if (err)
                    return done(err);
                self.mocks[0].createdAt = visit.createdAt;
                return done();
            });
        });
    });
    describe('[FAUX] /api/patient/{medicare_no}/visits', function () {
        beforeEach(function (done) {
            return self.patient_sdk.deregisterMany(self.patient_mocks, function () {
                return self.patient_sdk.registerMany(self.patient_mocks, done);
            });
        });
        afterEach(function (done) {
            return self.sdk.deregisterManyFaux(self.mocks, function (err) {
                return err && done(err) || self.patient_sdk.deregister(self.patient_mocks.patients[0], done);
            });
        });
        it('POST should create many Visit', function (done) {
            self.sdk.registerManyFaux(self.mocks, function (err, visits) {
                if (err)
                    return done(err);
                console.log('visits =', visits);
                for (var i = 0; i < visits.length; i++)
                    self.mocks[i].createdAt = visits[i].createdAt;
                return done();
            });
        });
    });
});
