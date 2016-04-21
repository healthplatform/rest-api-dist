"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var async = require('async');
var PrognosisTestSDK = (function () {
    function PrognosisTestSDK(app, token) {
        this.app = app;
        this.token = token;
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }
    PrognosisTestSDK.prototype.register = function (prognosis, cb) {
        if (!prognosis || Object.keys(prognosis).length < 1)
            return cb(new TypeError('prognosis argument to register must be defined'));
        supertest(this.app)
            .post("/api/patient/" + prognosis.medicare_no + "/prognosis")
            .set({ 'X-Access-Token': this.token })
            .send(prognosis)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            try {
                chai_1.expect(res.body).to.be.an('object');
                chai_1.expect(res.body).to.have.all.keys('acuity_left_eye_den', 'acuity_left_eye_num', 'acuity_right_eye_den', 'acuity_right_eye_num', 'createdAt', 'id', 'iop_left_eye', 'iop_right_eye', 'medicare_no', 'updatedAt');
            }
            catch (e) {
                err = e;
            }
            finally {
                cb(err, res.body);
            }
        });
    };
    PrognosisTestSDK.prototype.deregister = function (prognosis, cb) {
        if (!prognosis || Object.keys(prognosis).length < 1)
            return cb(new TypeError('prognosis argument to register must be defined'));
        supertest(this.app)
            .delete("/api/patient/" + prognosis.medicare_no + "/prognosis/" + prognosis.createdAt)
            .set({ 'X-Access-Token': this.token })
            .send(prognosis)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            try {
                chai_1.expect(res.statusCode).to.equal(204);
            }
            catch (e) {
                err = e;
            }
            finally {
                cb(err, res.body);
            }
        });
    };
    PrognosisTestSDK.prototype.registerManyFaux = function (prognoses, cb) {
        if (!prognoses || Object.keys(prognoses).length < 1 || prognoses.prognoses.length < 1)
            return cb(new TypeError('prognoses argument to registerManyFaux must be defined'));
        async.map(prognoses.prognoses, this.register, cb);
    };
    PrognosisTestSDK.prototype.deregisterManyFaux = function (prognoses, cb) {
        if (!prognoses || Object.keys(prognoses).length < 1 || prognoses.prognoses.length < 1)
            return cb(new TypeError('prognoses argument to deregisterManyFaux must be defined'));
        async.map(prognoses.prognoses, this.deregister, cb);
    };
    return PrognosisTestSDK;
}());
exports.PrognosisTestSDK = PrognosisTestSDK;
