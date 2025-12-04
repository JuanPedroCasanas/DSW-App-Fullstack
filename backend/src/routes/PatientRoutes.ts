import express from 'express';
import { PatientController } from '../controller/PatientController';
import { validate } from '../utils/validations/validate';
import { addIndPatientSchema } from '../utils/validations/schema/patient/addIndPatientSchema';
import { updateDepPatientSchema } from '../utils/validations/schema/patient/updateDepPatientSchema';
import { addDepPatientSchema } from '../utils/validations/schema/patient/addDepPatientSchema';
import { updateIndPatientSchema } from '../utils/validations/schema/patient/updateIndPatientSchema';
import { getDeletePatientSchema } from '../utils/validations/schema/patient/getDeletePatientSchema';
import { getByLegalGuardianPatientSchema } from '../utils/validations/schema/patient/getByLegalGuardianPatientSchema';

const router = express.Router();

router.post('/addIndPatient', validate(addIndPatientSchema), PatientController.addIndependentPatient);
router.post('/addDepPatient', validate(addDepPatientSchema), PatientController.addDependentPatient);
router.post('/updateDepPatient',validate(updateDepPatientSchema), PatientController.updateDependentPatient);
router.post('/updateIndPatient', validate(updateIndPatientSchema),PatientController.updateIndependentPatient);
router.get('/getAll', PatientController.getPatients);
router.get('/get/:idPatient', validate(getDeletePatientSchema), PatientController.getPatient);
router.get('/getByLegalGuardian/:idLegalGuardian', validate(getByLegalGuardianPatientSchema), PatientController.getByLegalGuardian)
router.delete('/delete/:idPatient', validate(getDeletePatientSchema), PatientController.deletePatient);


export default router;