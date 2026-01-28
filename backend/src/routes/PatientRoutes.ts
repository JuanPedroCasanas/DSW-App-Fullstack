import express from 'express';
import { PatientController } from '../controller/PatientController';
import { validate } from '../utils/validations/validate';
import { addIndPatientSchema } from '../utils/validations/schema/patient/addIndPatientSchema';
import { updateDepPatientSchema } from '../utils/validations/schema/patient/updateDepPatientSchema';
import { addDepPatientSchema } from '../utils/validations/schema/patient/addDepPatientSchema';
import { updateIndPatientSchema } from '../utils/validations/schema/patient/updateIndPatientSchema';
import { getDeletePatientSchema } from '../utils/validations/schema/patient/getDeletePatientSchema';
import { getByLegalGuardianPatientSchema } from '../utils/validations/schema/patient/getByLegalGuardianPatientSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';
import { UserRole } from '../utils/enums/UserRole';
import { authOwnedDependentPatientOrAdmin } from '../utils/auth/authOwnedDependentPatientOrAdmin';

const router = express.Router();

router.post(
  '/addIndPatient',
  validate(addIndPatientSchema),
  PatientController.addIndependentPatient
);

router.post(
  '/addDepPatient',
  validate(addDepPatientSchema),
  authJwt,
  authRoles([UserRole.Admin, UserRole.LegalGuardian]),
  PatientController.addDependentPatient
);

router.post(
  '/updateDepPatient',
  validate(updateDepPatientSchema),
  authJwt,
  authOwnedDependentPatientOrAdmin({ patientIdField: 'idPatient' }),
  PatientController.updateDependentPatient
);

router.post(
  '/updateIndPatient',
  validate(updateIndPatientSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Patient,
    paramId: 'idPatient',
    userField: 'patient',
  }),
  PatientController.updateIndependentPatient
);

router.get(
  '/getAll',
  authJwt,
  PatientController.getPatients
);

router.get(
  '/get/:idPatient',
  validate(getDeletePatientSchema),
  authJwt,
  PatientController.getPatient
);

router.get(
  '/getByLegalGuardian/:idLegalGuardian',
  validate(getByLegalGuardianPatientSchema),
  authJwt,
  PatientController.getByLegalGuardian
);

router.delete(
  '/delete/:idPatient',
  validate(getDeletePatientSchema),
  authJwt,
  authOwnedDependentPatientOrAdmin({ patientIdField: 'idPatient' }),
  PatientController.deletePatient
);

export default router;
