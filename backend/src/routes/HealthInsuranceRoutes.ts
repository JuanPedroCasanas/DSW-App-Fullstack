import express from 'express';
import { HealthInsuranceController } from '../controller/HealthInsuranceController';

const router = express.Router();

router.get('/', HealthInsuranceController.home);
router.post('/add', HealthInsuranceController.addHealthInsurance);
router.post('/update', HealthInsuranceController.updateHealthInsurance);
//router.get('/getAll', HealthInsuranceController.getHealthInsurance);
router.get('/get/:id', HealthInsuranceController.getHealthInsurance);
router.delete('/delete/:id', HealthInsuranceController.deleteHealthInsurance);


export default router;
