"use strict";
var _this = this;
var supertest = require('supertest');
var chai_1 = require('chai');
var main_1 = require('./../../../main');
describe('Root::routes', function () {
    before(function (done) {
        return main_1.main({}, function (app) {
            _this.app = app;
            done();
        }, true);
    });
    describe('/', function () {
        it('should get version', function (done) {
            return supertest(_this.app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect('Content-Length', '19')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    return done(err);
                chai_1.expect(res.statusCode).to.be.equal(200);
                chai_1.expect(res.body).to.have.property('version').with.length(5);
                return done();
            });
        });
    });
});
