"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var prognosis_test_sdk_1 = require('./prognosis_test_sdk');
var patient_test_sdk_1 = require('./../patient/patient_test_sdk');
var prognosis_mocks_1 = require('./prognosis_mocks');
var patient_mocks_1 = require('../patient/patient_mocks');
var auth_test_sdk_1 = require('../auth/auth_test_sdk');
var models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
    contact: main_1.all_models_and_routes['contact'],
    patient: main_1.all_models_and_routes['patient'],
    kv: main_1.all_models_and_routes['kv'],
    visit: main_1.all_models_and_routes['visit'],
    prognosis: main_1.all_models_and_routes['prognosis']
};
process.env.NO_SAMPLE_DATA = true;
describe('Prognosis::routes', function () {
    before(function (done) { return main_1.main(models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.patient_mocks = new patient_mocks_1.PatientMocks();
        _this.mocks = prognosis_mocks_1.PrognosisMocks;
        _this.authSDK = new auth_test_sdk_1.AuthTestSDK(_this.app);
        async.series([
            function (cb) { return _this.authSDK.logout_unregister(undefined, function () { return cb(); }); },
            function (cb) { return _this.authSDK.register_login(undefined, cb); }
        ], function (err, responses) {
            if (err) {
                return done(err);
            }
            _this.token = responses[1];
            _this.sdk = new prognosis_test_sdk_1.PrognosisTestSDK(_this.app, _this.token);
            _this.patientSDK = new patient_test_sdk_1.PatientTestSDK(_this.app, _this.token);
            return done();
        });
    }); });
    after(function (done) {
        return async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), done);
    });
});
