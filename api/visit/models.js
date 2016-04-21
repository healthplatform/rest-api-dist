"use strict";
var main_1 = require('../../main');
var errors_1 = require('./../../utils/errors');
var helpers_1 = require('../../utils/helpers');
exports.Visit = {
    identity: 'visit_tbl',
    connection: 'postgres',
    beforeValidate: function (visit, next) {
        var Patient = main_1.collections['patient_tbl'];
        Patient.count({ medicare_no: visit.medicare_no }, function (err, count) {
            if (err)
                return next(errors_1.fmtError(err));
            else if (!count)
                return next(new errors_1.NotFoundError('patient'));
            visit.createdAt = helpers_1.getUTCDate();
            visit.updatedAt = visit.createdAt;
            visit.id = visit.medicare_no + "\t" + visit.createdAt.toISOString();
            return next();
        });
    },
    attributes: {
        id: {
            required: true,
            primaryKey: true,
            type: 'string'
        },
        acuity_left_eye_num: {
            type: 'integer'
        },
        acuity_right_eye_num: {
            type: 'integer'
        },
        acuity_left_eye_den: {
            type: 'integer'
        },
        acuity_right_eye_den: {
            type: 'integer'
        },
        callback: {
            type: 'date'
        },
        cct_left_eye: {
            type: 'integer'
        },
        cct_right_eye: {
            type: 'integer'
        },
        gonio_left_eye: {
            type: 'integer'
        },
        gonio_right_eye: {
            type: 'integer'
        },
        iop_left_eye: {
            type: 'integer'
        },
        iop_right_eye: {
            type: 'integer'
        },
        medicare_no: {
            required: true,
            type: 'string'
        },
        prognoses: {
            collection: 'prognosis_tbl',
            via: 'medicare_no'
        },
        reason: {
            type: 'string'
        },
        refraction_left_eye: {
            type: 'integer'
        },
        refraction_right_eye: {
            type: 'integer'
        },
        retinal_disc_left_eye: {
            type: 'string'
        },
        retinal_disc_right_eye: {
            type: 'string'
        },
        vf_left_eye: {
            type: 'string'
        },
        vf_right_eye: {
            type: 'string'
        },
        toJSON: function toJSON() {
            var visit = this.toObject();
            for (var key in visit)
                if (visit.hasOwnProperty(key) && !visit[key])
                    delete visit[key];
            return visit;
        },
    }
};
