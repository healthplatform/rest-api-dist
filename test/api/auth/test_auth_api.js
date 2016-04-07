"use strict";
var _this = this;
var async = require('async');
var main_1 = require('./../../../main');
var auth_test_sdk_1 = require('./../auth/auth_test_sdk');
var models_1 = require('./../../../api/auth/models');
var user_mocks_1 = require('./../user/user_mocks');
var user_models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
};
describe('Auth::routes', function () {
    before(function (done) { return main_1.main(user_models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.sdk = new auth_test_sdk_1.AuthTestSDK(_this.app);
        done();
    }); });
    after(function (done) {
        return async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
    });
    describe('/api/auth', function () {
        beforeEach(function (done) { return _this.sdk.unregister_all(user_mocks_1.user_mocks.successes, function () { return done(); }); });
        afterEach(function (done) { return _this.sdk.unregister_all(user_mocks_1.user_mocks.successes, function () { return done(); }); });
        it('POST should login user', function (done) {
            async.series([
                function (cb) { return _this.sdk.register(user_mocks_1.user_mocks.successes[1], cb); },
                function (cb) { return _this.sdk.login(user_mocks_1.user_mocks.successes[1], cb); }
            ], done);
        });
        it('DELETE should logout user', function (done) {
            var sdk = _this.sdk;
            async.waterfall([
                function (cb) { return _this.sdk.register(user_mocks_1.user_mocks.successes[1], cb); },
                function (_, cb) { return sdk.login(user_mocks_1.user_mocks.successes[1], function (err, res) {
                    return err ? cb(err) : cb(null, res.body.access_token);
                }); },
                function (access_token, cb) {
                    return sdk.logout(access_token, function (err, res) {
                        return cb(err, access_token);
                    });
                },
                function (access_token, cb) {
                    return models_1.AccessToken().findOne(access_token, function (e, r) {
                        return cb(!e ? new Error("Access token wasn't invalidated/removed") : null);
                    });
                }
            ], function (err, results) { return done(err); });
        });
    });
});
