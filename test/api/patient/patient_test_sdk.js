"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
function test_sdk(app) {
    return {
        register: function register(patient, cb) {
            if (!patient)
                return cb(new TypeError('patient argument to register must be defined'));
            supertest(app)
                .post('/api/patient')
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
        },
        deregister: function deregister(patient, cb) {
            if (!patient)
                return cb(new TypeError('patient argument to deregister must be defined'));
            supertest(app)
                .del("/api/patient/" + patient.medicare_no)
                .send(patient)
                .end(function (err, res) {
                if (err)
                    return cb(err);
                chai_1.expect(res.statusCode).to.equal(204);
                return cb(err, res);
            });
        },
        registerMany: function registerMany(patients, cb) {
            if (!patients)
                return cb(new TypeError('patients argument to registerManyFaux must be defined'));
            supertest(app)
                .post('/api/patients')
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
        },
        deregisterMany: function deregisterMany(patients, cb) {
            if (!patients)
                return cb(new TypeError('patients argument to deregisterManyFaux must be defined'));
            supertest(app)
                .del("/api/patients")
                .send(patients)
                .end(function (err, res) {
                if (err)
                    return cb(err);
                else if (res.statusCode / 100 >= 3)
                    return cb(new Error(JSON.stringify(res.text, null, 4)));
                chai_1.expect(res.statusCode).to.equal(204);
                return cb(err, res);
            });
        }
    };
}
exports.test_sdk = test_sdk;
