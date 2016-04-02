"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
function test_sdk(app) {
    return {
        register: function register(historic, cb) {
            if (!historic)
                return cb(new TypeError('historic argument to register must be defined'));
            supertest(app)
                .post("/api/patient/" + historic.medicare_no + "/historic")
                .send(historic)
                .end(function (err, res) {
                if (err)
                    return cb(err);
                else if (res.statusCode / 100 >= 3)
                    return cb(new Error(JSON.stringify(res.text, null, 4)));
                chai_1.expect(Object.keys(res.body).sort()).to.deep.equal([
                    'asthma', 'createdAt', 'diabetes', 'ethnicity',
                    'hbA1c', 'hypertension', 'medicare_no', 'updatedAt'
                ]);
                return cb(err, res);
            });
        },
        deregister: function deregister(historic, cb) {
            if (!historic)
                return cb(new TypeError('historic argument to register must be defined'));
            supertest(app)
                .delete("/api/patient/" + historic.medicare_no + "/historic")
                .send(historic)
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
