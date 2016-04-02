"use strict";
var patient_mocks_1 = require('./../patient/patient_mocks');
var patientMocks = new patient_mocks_1.PatientMocks();
function monthsFromNow(num) {
    var d = new Date();
    d.setMonth(d.getMonth() + num);
    return d;
}
exports.HistoricMocks = [
    {
        medicare_no: patientMocks.patients[0].medicare_no,
        hypertension: true, asthma: true, diabetes: true,
        diabetesType: 'II', diabeticSince: monthsFromNow(-12),
        diabetesControl: 'moderate', hbA1c: 11.0, ethnicity: 'anglo',
        eyedropIntolerance: 'nil', familySocialHistory: 'bank-teller'
    },
    {
        medicare_no: patientMocks.patients[1].medicare_no,
        hypertension: false, asthma: true, diabetes: false,
        diabetesType: 'II', diabeticSince: monthsFromNow(-24),
        diabetesControl: 'low', hbA1c: 11.0, ethnicity: 'indian',
        eyedropIntolerance: 'nil', familySocialHistory: 'accountant'
    },
    {
        medicare_no: patientMocks.patients[2].medicare_no,
        hypertension: true, asthma: false, diabetes: false,
        diabetesType: 'I', diabeticSince: monthsFromNow(-40),
        diabetesControl: 'high', hbA1c: 11.0, ethnicity: 'african',
        eyedropIntolerance: 'nil', familySocialHistory: 'trumpeter'
    },
    {
        medicare_no: patientMocks.patients[3].medicare_no,
        hypertension: true, asthma: true, diabetes: true,
        diabetesType: 'II', diabeticSince: monthsFromNow(-12),
        diabetesControl: 'moderate', hbA1c: 11.0, ethnicity: 'anglo',
        eyedropIntolerance: 'nil', familySocialHistory: 'bank-teller'
    },
    {
        medicare_no: patientMocks.patients[4].medicare_no,
        hypertension: true, asthma: true, diabetes: true,
        diabetesType: 'II', diabeticSince: monthsFromNow(-12),
        diabetesControl: 'moderate', hbA1c: 11.0, ethnicity: 'anglo',
        eyedropIntolerance: 'nil', familySocialHistory: 'bank-teller'
    }
];
