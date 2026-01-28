import express from 'express';
import { HealthInsuranceController } from '../controller/HealthInsuranceController';
import { validate } from '../utils/validations/validate';
import { addHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/addHealthInsuranceSchema';
import { updateHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/updateHealthInsuranceSchema';
import { getByProfessionalHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getByProfessionalHealthInsuranceSchema';
import { getDeleteHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getDeleteHealthInsuranceSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

router.post(
  '/add',
  validate(addHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.addHealthInsurance
);

router.post(
  '/update',
  validate(updateHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.updateHealthInsurance
);

router.delete(
  '/delete/:idHealthInsurance',
  validate(getDeleteHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.deleteHealthInsurance
);

router.get(
  '/getAll',
  HealthInsuranceController.getAllHealthInsurances
);

router.get(
  '/get/:idHealthInsurance',
  validate(getDeleteHealthInsuranceSchema),
  HealthInsuranceController.getHealthInsurance
);

router.get(
  '/getHealthInsurancesByProfessional/:idProfessional',
  validate(getByProfessionalHealthInsuranceSchema),
  HealthInsuranceController.getHealthInsuranceByProfessional
);

export default router;
