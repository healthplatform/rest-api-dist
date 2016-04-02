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
        toJSON: function toJSON() {
            var visit = this.toObject();
            for (var key in visit)
                if (!visit[key])
                    delete visit[key];
            return visit;
        }
    }
};
