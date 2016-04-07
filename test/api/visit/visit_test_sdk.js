"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var async = require('async');
var VisitTestSDK = (function () {
    function VisitTestSDK(app, token) {
        this.app = app;
        this.token = token;
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }
    VisitTestSDK.prototype.register = function (visit, cb) {
        if (!visit)
            return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .post("/api/patient/" + visit.medicare_no + "/visit")
            .set({ 'X-Access-Token': this.token })
            .send(visit)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(Object.keys(res.body).sort()).to.deep.equal([
                'createdAt', 'id', 'iop_left_eye', 'medicare_no', 'updatedAt'
            ]);
            return cb(err, res.body);
        });
    };
    VisitTestSDK.prototype.deregister = function (visit, cb) {
        if (!visit)
            return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .delete("/api/patient/" + visit.medicare_no + "/visit/" + visit.createdAt)
            .set({ 'X-Access-Token': this.token })
            .send(visit)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(res.statusCode).to.equal(204);
            return cb(err, res.body);
        });
    };
    VisitTestSDK.prototype.registerManyFaux = function (visits, cb) {
        if (!visits)
            return cb(new TypeError('visits argument to registerManyFaux must be defined'));
        async.map(visits.visits, this.register, cb);
    };
    VisitTestSDK.prototype.deregisterManyFaux = function (visits, cb) {
        if (!visits)
            return cb(new TypeError('visits argument to deregisterManyFaux must be defined'));
        async.map(visits.visits, this.deregister, cb);
    };
    return VisitTestSDK;
}());
exports.VisitTestSDK = VisitTestSDK;
