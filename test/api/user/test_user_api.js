"use strict";
var _this = this;
var supertest = require('supertest');
var chai_1 = require('chai');
var async = require('async');
var main_1 = require('./../../../main');
var auth_test_sdk_1 = require('./../auth/auth_test_sdk');
var models_1 = require('./../../../api/auth/models');
var user_mocks_1 = require('./user_mocks');
var user_models_and_routes = {
    user: main_1.all_models_and_routes['user'],
    auth: main_1.all_models_and_routes['auth'],
};
describe('User::routes', function () {
    before(function (done) { return main_1.main(user_models_and_routes, function (app, connections) {
        _this.connections = connections;
        _this.app = app;
        _this.sdk = new auth_test_sdk_1.AuthTestSDK(_this.app);
        done();
    }); });
    after(function (done) {
        return _this.connections && async.parallel(Object.keys(_this.connections).map(function (connection) { return _this.connections[connection]._adapter.teardown; }), function (err, _res) { return done(err); });
    });
    describe('/api/user', function () {
        beforeEach(function (done) { return _this.sdk.unregister_all(user_mocks_1.user_mocks.successes, done); });
        afterEach(function (done) { return _this.sdk.unregister_all(user_mocks_1.user_mocks.successes, done); });
        it('POST should create user', function (done) {
            _this.sdk.register(user_mocks_1.user_mocks.successes[0], done);
        });
        it('GET should retrieve user', function (done) {
            var sdk = _this.sdk;
            async.waterfall([
                function (cb) { return sdk.register(user_mocks_1.user_mocks.successes[1], cb); },
                function (_, cb) { return sdk.login(user_mocks_1.user_mocks.successes[1], function (err, res) {
                    return err ? cb(err) : cb(null, res.body.access_token);
                }); },
                function (access_token, cb) {
                    return sdk.get_user(access_token, user_mocks_1.user_mocks.successes[1], cb);
                }
            ], function (err, results) { return done(err); });
        });
        it('PUT should edit user', function (done) {
            var sdk = _this.sdk;
            async.waterfall([
                function (cb) { return _this.sdk.register(user_mocks_1.user_mocks.successes[1], cb); },
                function (_, cb) { return sdk.login(user_mocks_1.user_mocks.successes[1], function (err, res) {
                    return err ? cb(err) : cb(null, res.body.access_token);
                }); },
                function (access_token, cb) {
                    return supertest(_this.app)
                        .put('/api/user')
                        .set({ 'X-Access-Token': access_token })
                        .send({ title: 'Mr' })
                        .end(cb);
                },
                function (r, cb) {
                    if (r.statusCode / 100 >= 3)
                        return done(new Error(JSON.stringify(r.text, null, 4)));
                    chai_1.expect(Object.keys(r.body).sort()).to.deep.equal(['createdAt', 'email', 'title', 'updatedAt']);
                    chai_1.expect(r.body.title).equals('Mr');
                    return cb();
                }
            ], function (err, results) { return done(err); });
        });
        it('DELETE should unregister user', function (done) {
            var sdk = _this.sdk;
            async.waterfall([
                function (cb) { return _this.sdk.register(user_mocks_1.user_mocks.successes[2], cb); },
                function (_, cb) { return sdk.login(user_mocks_1.user_mocks.successes[2], function (err, res) {
                    return err ? cb(err) : cb(null, res.body.access_token);
                }); },
                function (access_token, cb) {
                    return sdk.unregister({ access_token: access_token }, function (err, res) {
                        return cb(err, access_token);
                    });
                },
                function (access_token, cb) {
                    models_1.AccessToken().findOne(access_token, function (e, r) {
                        return cb(!e ? new Error("Access token wasn't invalidated/removed") : null);
                    });
                }
            ], function (err, results) { return done(err); });
        });
    });
});
