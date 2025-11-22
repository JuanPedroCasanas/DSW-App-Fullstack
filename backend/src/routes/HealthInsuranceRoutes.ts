import express from 'express';
import { HealthInsuranceController } from '../controller/HealthInsuranceController';
import { validate } from '../utils/validations/validate';
import { addHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/addHealthInsuranceSchema';
import { updateHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/updateHealthInsuranceSchema';
import { getByProfessionalHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getByProfessionalHealthInsuranceSchema';
import { getDeleteHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getDeleteHealthInsuranceSchema';

const router = express.Router();

router.get('/', HealthInsuranceController.home);
router.post('/add', validate(addHealthInsuranceSchema), HealthInsuranceController.addHealthInsurance);
router.post('/update', validate(updateHealthInsuranceSchema), HealthInsuranceController.updateHealthInsurance);
router.get('/getHealthInsurancesByProfessional/:idProfessional', validate(getByProfessionalHealthInsuranceSchema),HealthInsuranceController.getHealthInsuranceByProfessional);
router.get('/getAll', HealthInsuranceController.getAllHealthInsurances);
router.get('/get/:idHealthInsurance', validate(getDeleteHealthInsuranceSchema),HealthInsuranceController.getHealthInsurance);
router.delete('/delete/:idHealthInsurance', validate(getDeleteHealthInsuranceSchema), HealthInsuranceController.deleteHealthInsurance);


export default router;
