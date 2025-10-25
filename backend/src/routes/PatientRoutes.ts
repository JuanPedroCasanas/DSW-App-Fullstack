import express from 'express';
import { PatientController } from '../controller/PatientController';

const router = express.Router();

router.get('/', PatientController.home);
router.post('/addIndPatient', PatientController.addIndependentPatient);
router.post('/addDepPatient', PatientController.addDependentPatient);
router.post('/updateDepPatient', PatientController.updateDependentPatient);
router.post('/updateIndPatient', PatientController.updateIndependentPatient);
router.get('/getAll', PatientController.getPatients);
router.get('/get/:id', PatientController.getPatient);
router.get('/getByLegalGuardian/:id', PatientController.getByLegalGuardian)
router.delete('/delete/:id', PatientController.deletePatient);


export default router;