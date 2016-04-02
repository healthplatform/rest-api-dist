"use strict";
exports.Historic = {
    identity: 'patient_historic_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        hypertension: {
            type: 'boolean'
        },
        asthma: {
            type: 'boolean'
        },
        diabetes: {
            type: 'boolean'
        },
        diabetes_type: {
            type: 'string'
        },
        diabetic_since: {
            type: 'date'
        },
        diabetes_control: {
            type: 'string'
        },
        hbA1c: {
            type: 'numeric'
        },
        eyedrop_intolerance: {
            type: 'string'
        },
        family_social_history: {
            type: 'string'
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
