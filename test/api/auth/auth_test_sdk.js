"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var async = require('async');
function test_sdk(app) {
    return {
        register: function register(user, cb) {
            if (!user)
                return cb(new TypeError('user argument to register must be defined'));
            supertest(app)
                .post('/api/user')
                .send(user)
                .end(function (err, res) {
                if (err)
                    return cb(err);
                else if (res.statusCode / 100 >= 3)
                    return cb(new Error(JSON.stringify(res.text, null, 4)));
                chai_1.expect(Object.keys(res.body).sort()).to.deep.equal(['createdAt', 'email', 'updatedAt']);
                return cb(err, res);
            });
        },
        login: function login(user, cb) {
            if (!user)
                return cb(new TypeError('user argument to login must be defined'));
            supertest(app)
                .post('/api/auth')
                .send(user)
                .end(function (err, res) {
                if (err)
                    return cb(err);
                else if (res.statusCode / 100 >= 3)
                    return cb(new Error(JSON.stringify(res.text, null, 4)));
                chai_1.expect(Object.keys(res.body)).to.deep.equal(['access_token']);
                return cb(err, res);
            });
        },
        get_user: function get_user(access_token, user, cb) {
            if (!access_token)
                return cb(new TypeError('access_token argument to get_user must be defined'));
            supertest(app)
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
        },
        logout: function logout(access_token, cb) {
            if (!access_token)
                return cb(new TypeError('access_token argument to logout must be defined'));
            supertest(app)
                .delete('/api/auth')
                .set({ 'X-Access-Token': access_token })
                .expect(204)
                .end(cb);
        },
        unregister: function unregister(ident, cb) {
            if (!ident)
                return cb(new TypeError('ident argument to unregister must be defined'));
            if (ident.access_token)
                supertest(app)
                    .delete('/api/user')
                    .set({ 'X-Access-Token': ident.access_token })
                    .expect(204)
                    .end(cb);
            else
                supertest(app)
                    .delete('/api/user')
                    .send({ email: ident.user_id })
                    .expect(204)
                    .end(cb);
        }
    };
}
exports.test_sdk = test_sdk;
function unregister_all(sdk, users, done) {
    async.map(users, function (user, callback) { return async.waterfall([
        function (cb) { return sdk.login(user, function (err, res) {
            return err ? cb(err) : cb(null, res.body.access_token);
        }); },
        function (access_token, cb) {
            return sdk.unregister({ access_token: access_token }, function (err, res) {
                return cb(err, access_token);
            });
        },
    ], callback); }, function (err, res) { return done(null); });
}
exports.unregister_all = unregister_all;
