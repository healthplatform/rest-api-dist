"use strict";
exports.Visit = {
    identity: 'visit_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            type: 'string',
            required: true
        },
        reason: {
            type: 'string'
        },
        acuity_right_eye: {
            type: 'integer'
        },
        iop_right_eye: {
            type: 'integer'
        },
        gonio_right_eye: {
            type: 'integer'
        },
        refraction_right_eye: {
            type: 'integer'
        },
        cct_right_eye: {
            type: 'integer'
        },
        vf_right_eye: {
            type: 'string'
        },
        retinal_disc_right_eye: {
            type: 'string'
        },
        acuity_left_eye: {
            type: 'integer'
        },
        iop_left_eye: {
            type: 'integer'
        },
        gonio_left_eye: {
            type: 'integer'
        },
        refraction_left_eye: {
            type: 'integer'
        },
        cct_left_eye: {
            type: 'integer'
        },
        vf_left_eye: {
            type: 'string'
        },
        retinal_disc_left_eye: {
            type: 'string'
        },
        callback: {
            type: 'date'
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
