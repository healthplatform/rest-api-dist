"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var async = require('async');
var user_mocks_1 = require('../user/user_mocks');
var AuthTestSDK = (function () {
    function AuthTestSDK(app) {
        this.app = app;
    }
    AuthTestSDK.prototype.register = function (user, cb) {
        if (!user)
            return cb(new TypeError('user argument to register must be defined'));
        supertest(this.app)
            .post('/api/user')
            .send(user)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(res.statusCode).to.be.equal(201);
            chai_1.expect(Object.keys(res.body).sort()).to.deep.equal(['createdAt', 'email', 'updatedAt']);
            return cb(err, res);
        });
    };
    AuthTestSDK.prototype.login = function (user, cb) {
        if (!user)
            return cb(new TypeError('user argument to login must be defined'));
        supertest(this.app)
            .post('/api/auth')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(Object.keys(res.body)).to.deep.equal(['access_token']);
            return cb(err, res);
        });
    };
    AuthTestSDK.prototype.get_user = function (access_token, user, cb) {
        if (!access_token)
            return cb(new TypeError('access_token argument to get_user must be defined'));
        supertest(this.app)
            .get('/api/user')
            .set({ 'X-Access-Token': access_token })
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            Object.keys(user).map(function (attr) { return chai_1.expect(user[attr] === res.body[attr]); });
            return cb(err, res);
        });
    };
    AuthTestSDK.prototype.logout = function (access_token, cb) {
        if (!access_token)
            return cb(new TypeError('access_token argument to logout must be defined'));
        supertest(this.app)
            .delete('/api/auth')
            .set({ 'X-Access-Token': access_token })
            .expect(204)
            .end(cb);
    };
    AuthTestSDK.prototype.unregister = function (ident, cb) {
        if (!ident)
            return cb(new TypeError('ident argument to unregister must be defined'));
        if (ident.access_token)
            supertest(this.app)
                .delete('/api/user')
                .set({ 'X-Access-Token': ident.access_token })
                .expect(204)
                .end(cb);
        else
            supertest(this.app)
                .delete('/api/user')
                .send({ email: ident.user_id })
                .expect(204)
                .end(cb);
    };
    AuthTestSDK.prototype.unregister_all = function (users, done) {
        var _this = this;
        async.map(users, function (user, callback) {
            return async.waterfall([
                function (cb) { return _this.login(user, function (err, res) {
                    return err ? cb(err) : cb(null, res.body.access_token);
                }); },
                function (access_token, cb) {
                    return _this.unregister({ access_token: access_token }, function (err, res) {
                        return cb(err, access_token);
                    });
                },
            ], callback);
        }, done);
    };
    AuthTestSDK.prototype.register_login = function (user, done) {
        var _this = this;
        user = user || user_mocks_1.user_mocks.successes[0];
        if (!user) {
            return done(new TypeError('user undefined in `register_login`'));
        }
        async.series([
            function (cb) { return _this.register(user, cb); },
            function (cb) { return _this.login(user, cb); }
        ], function (err, results) {
            if (err) {
                return done(err);
            }
            return done(err, results[1].get('x-access-token'));
        });
    };
    AuthTestSDK.prototype.logout_unregister = function (user, done) {
        user = user || user_mocks_1.user_mocks.successes[0];
        if (!user) {
            return done(new TypeError('user undefined in `logout_unregister`'));
        }
        this.unregister_all([user], done);
    };
    return AuthTestSDK;
}());
exports.AuthTestSDK = AuthTestSDK;
