"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var PatientTestSDK = (function () {
    function PatientTestSDK(app, token) {
        this.app = app;
        this.token = token;
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }
    PatientTestSDK.prototype.register = function (patient, cb) {
        if (!patient)
            return cb(new TypeError('patient argument to register must be defined'));
        supertest(this.app)
            .post('/api/patient')
            .set({ 'X-Access-Token': this.token })
            .send(patient)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(Object.keys(res.body).sort()).to.deep.equal([
                'contact', 'createdAt', 'dob', 'gp', 'medicare_no', 'sex', 'updatedAt'
            ]);
            return cb(err, res);
        });
    };
    PatientTestSDK.prototype.deregister = function (patient, cb) {
        if (!patient)
            return cb(new TypeError('patient argument to deregister must be defined'));
        supertest(this.app)
            .del("/api/patient/" + patient.medicare_no)
            .set({ 'X-Access-Token': this.token })
            .send(patient)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(res.statusCode).to.equal(204);
            return cb(err, res);
        });
    };
    PatientTestSDK.prototype.registerMany = function (patients, cb) {
        if (!patients)
            return cb(new TypeError('patients argument to registerMany must be defined'));
        supertest(this.app)
            .post('/api/patients')
            .set({ 'X-Access-Token': this.token })
            .send(patients)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(res.body).to.be.an('object');
            chai_1.expect(res.body).to.have.property('patients');
            chai_1.expect(res.body.patients).to.be.an.instanceof(Array);
            chai_1.expect(res.body.patients).to.have.length.above(0);
            res.body.patients.map(function (patient) { return chai_1.expect(Object.keys(patient).sort()).to.deep.equal([
                'contact', 'createdAt', 'dob', 'gp', 'medicare_no', 'sex', 'updatedAt'
            ]); });
            return cb(err, res);
        });
    };
    PatientTestSDK.prototype.deregisterMany = function (patients, cb) {
        if (!patients)
            return cb(new TypeError('patients argument to deregisterMany must be defined'));
        supertest(this.app)
            .del("/api/patients")
            .set({ 'X-Access-Token': this.token })
            .send(patients)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            chai_1.expect(res.statusCode).to.equal(204);
            return cb(err, res);
        });
    };
    return PatientTestSDK;
}());
exports.PatientTestSDK = PatientTestSDK;
