"use strict";
var main_1 = require('../../main');
var errors_1 = require('./../../utils/errors');
exports.Prognosis = {
    identity: 'prognosis_tbl',
    connection: 'postgres',
    beforeValidate: function (prognosis, next) {
        var Patient = main_1.collections['patient_tbl'], Visit = main_1.collections['visit_tbl'];
        Patient.count({ medicare_no: prognosis.medicare_no }, function (err, patientCount) {
            if (err)
                return next(errors_1.fmtError(err));
            else if (!patientCount)
                return next(new errors_1.NotFoundError('patient'));
            Visit.count({ medicare_no: prognosis.medicare_no, visit_created_at: prognosis.visit_created_at }, function (error, visitCount) {
                if (error)
                    return next(errors_1.fmtError(error));
                else if (!visitCount)
                    return next(new errors_1.NotFoundError('visit'));
                return next();
            });
        });
    },
    attributes: {
        medicare_no: {
            required: true,
            type: 'string'
        },
        visit: {
            model: 'visit_tbl'
        },
        visit_created_at: {
            required: true,
            type: 'string'
        },
        prognosis: {
            required: true,
            type: 'string'
        },
        intervention: {
            required: true,
            type: 'string'
        },
        toJSON: function toJSON() {
            var prognosis = this.toObject();
            for (var key in prognosis)
                if (prognosis.hasOwnProperty(key) && !prognosis[key])
                    delete prognosis[key];
            return prognosis;
        }
    }
};
