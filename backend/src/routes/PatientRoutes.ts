import express from 'express';
import { PatientController } from '../controller/PatientController';

const router = express.Router();

router.get('/', PatientController.home);
router.post('/add', PatientController.addPatient);
router.post('/update', PatientController.updatePatient);
router.get('/getAll', PatientController.getPatients);
router.get('/get/:id', PatientController.getPatient);
router.delete('/delete/:id', PatientController.deletePatient);


export default router;