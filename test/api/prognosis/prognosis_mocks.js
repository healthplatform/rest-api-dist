"use strict";
var patient_mocks_1 = require('./../patient/patient_mocks');
var visit_mocks_1 = require('../visit/visit_mocks');
var patientMocks = new patient_mocks_1.PatientMocks();
var visitMocks = visit_mocks_1.VisitMocks;
exports.PrognosisMocks = [
    {
        medicare_no: patientMocks.patients[0].medicare_no,
    },
    {
        medicare_no: patientMocks.patients[1].medicare_no,
    },
    {
        medicare_no: patientMocks.patients[2].medicare_no,
    },
    {
        medicare_no: patientMocks.patients[3].medicare_no,
    },
    {
        medicare_no: patientMocks.patients[4].medicare_no,
    }
];
