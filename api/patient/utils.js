"use strict";
var async = require('async');
var main_1 = require('../../main');
var errors_1 = require('./../../utils/errors');
function createPatient(newPatient, callback) {
    var Patient = main_1.collections['patient_tbl'], Contact = main_1.collections['contact_tbl'];
    var b_contact = newPatient.contact;
    delete newPatient.contact;
    var gp = newPatient.gp;
    delete newPatient.gp;
    var other_specialists = newPatient.other_specialists;
    delete newPatient.other_specialists;
    if (!b_contact)
        return callback(new errors_1.NotFoundError('patient.contact'));
    async.waterfall([
        function (cb) { return Contact.findOrCreate(b_contact).exec(function (err, contact) {
            if (err)
                return cb(err);
            else if (!contact)
                return cb(new errors_1.NotFoundError('patient.contact'));
            return cb(null, contact.id);
        }); },
        function (b_contactId, cb) { return gp ? Contact.findOrCreate(gp).exec(function (err, contact) {
            if (err)
                return cb(err);
            else if (!contact)
                return cb(new errors_1.NotFoundError('gp.contact'));
            return cb(null, b_contactId, contact.id);
        }) : cb(null, b_contactId, null); },
        function (b_contactId, gpId, cb) { return other_specialists && other_specialists.length ?
            async.map(other_specialists, function (specialist, _cb) { return Contact.findOrCreate(specialist, _cb); }, function (err, specialists) { return cb(err, b_contactId, gpId, specialists); }) : cb(null, b_contactId, gpId, null); },
        function (b_contactId, gpId, other_specialistsRes, cb) {
            newPatient.contact = b_contactId;
            if (gp)
                newPatient.gp = gpId;
            if (other_specialistsRes && other_specialistsRes.length)
                newPatient.other_specialists = other_specialistsRes.map(function (c) { return c.id; });
            Patient.create(newPatient).exec(function (err, patient) {
                return cb(patient ? err : err || new errors_1.NotFoundError('patient'), patient);
            });
        }
    ], callback);
}
exports.createPatient = createPatient;
