"use strict";
var supertest = require('supertest');
var chai_1 = require('chai');
var HistoricTestSDK = (function () {
    function HistoricTestSDK(app, token) {
        this.app = app;
        this.token = token;
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }
    HistoricTestSDK.prototype.register = function (historic, cb) {
        if (!historic || Object.keys(historic).length < 1)
            return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .post("/api/patient/" + historic.medicare_no + "/historic")
            .set({ 'X-Access-Token': this.token })
            .send(historic)
            .end(function (err, res) {
            if (err)
                return cb(err);
            else if (res.statusCode / 100 >= 3)
                return cb(new Error(JSON.stringify(res.text, null, 4)));
            try {
                chai_1.expect(res.body).to.be.an('object');
                chai_1.expect(res.body).to.have.all.keys('asthma', 'createdAt', 'diabetes', 'ethnicity', 'hbA1c', 'hypertension', 'medicare_no', 'updatedAt');
            }
            catch (e) {
                err = e;
            }
            finally {
                cb(err, res);
            }
        });
    };
    HistoricTestSDK.prototype.deregister = function (historic, cb) {
        if (!historic || Object.keys(historic).length < 1)
            return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .delete("/api/patient/" + historic.medicare_no + "/historic")
            .set({ 'X-Access-Token': this.token })
            .send(historic)
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
                cb(err, res);
            }
        });
    };
    return HistoricTestSDK;
}());
exports.HistoricTestSDK = HistoricTestSDK;
