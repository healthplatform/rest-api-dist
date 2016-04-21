"use strict";
exports.Patient = {
    identity: 'patient_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        sex: {
            type: 'string'
        },
        dob: {
            type: 'date',
        },
        contact: {
            model: 'contact_tbl'
        },
        gp: {
            model: 'contact_tbl'
        },
        other_specialists: {
            collection: 'contact_tbl',
            via: 'id'
        },
        ethnicity: {
            type: 'string'
        },
        visits: {
            collection: 'visit_tbl',
            via: 'medicare_no'
        },
        toJSON: function toJSON() {
            var patient = this.toObject();
            for (var key in patient)
                if (patient.hasOwnProperty(key) && !patient[key])
                    delete patient[key];
            return patient;
        }
    }
};
