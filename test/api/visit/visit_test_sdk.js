"use strict";
var supertest = require('supertest');
var async = require('async');
var chai_1 = require('chai');
var g_app;
var g_token;
var VisitTestSDK = (function () {
    function VisitTestSDK(app, token) {
        this.app = app;
        this.token = token;
        g_app = app;
        g_token = token;
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }
    VisitTestSDK.prototype.register = function (visit, cb) {
        if (!visit || Object.keys(visit).length < 1)
            return cb(new TypeError('visit argument to register must be defined'));
        else if (!visit.medicare_no)
            return cb(new TypeError('visit doesn\'t have medicare_no attribute'));
        supertest(g_app)
            .post("/api/patient/" + visit.medicare_no + "/visit")
            .set({ 'X-Access-Token': g_token })
            .send(visit)
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
    VisitTestSDK.prototype.deregister = function (visit, cb) {
        if (!visit || visit === undefined || Object.keys(visit).length < 1)
            return cb(new TypeError('visit argument to register must be defined'));
        else if (!visit.medicare_no)
            return cb(new TypeError('visit doesn\'t have medicare_no attribute'));
        else if (!visit.createdAt)
            return cb(new TypeError('visit doesn\'t have createdAt attribute'));
        supertest(g_app)
            .delete("/api/patient/" + visit.medicare_no + "/visit/" + visit.createdAt)
            .set({ 'X-Access-Token': g_token })
            .send(visit)
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
    VisitTestSDK.prototype.registerManyFaux = function (visits, cb) {
        if (!visits
            || visits === undefined
            || Object.keys(visits).length < 1
            || visits.visits === undefined
            || visits.visits.length === undefined
            || visits.visits.length < 1)
            return cb(new TypeError('visits argument to registerManyFaux must be defined'));
        async.map(visits.visits, this.register, cb);
    };
    VisitTestSDK.prototype.deregisterManyFaux = function (visits, cb) {
        if (!visits
            || visits === undefined
            || Object.keys(visits).length < 1
            || visits.visits === undefined
            || visits.visits.length === undefined
            || visits.visits.length < 1)
            return cb(new TypeError('visits argument to deregisterManyFaux must be defined'));
        async.map(visits.visits, this.deregister, cb);
    };
    return VisitTestSDK;
}());
exports.VisitTestSDK = VisitTestSDK;
