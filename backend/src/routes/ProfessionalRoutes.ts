import express from 'express';
import { ProfessionalController } from '../controller/ProfessionalController';
import { addProfessionalSchema } from '../utils/validations/schema/professional/addProfessionalSchema';
import { validate } from '../utils/validations/validate';
import { updateProfessionalSchema } from '../utils/validations/schema/professional/updateProfessionalSchema';
import { allowForbidHealthInsuranceSchema } from '../utils/validations/schema/professional/allowForbidHealthInsuranceSchema';
import { getDeleteProfessionalSchema } from '../utils/validations/schema/professional/getDeleteProfessionalSchema';
import { getProfessionalsByOccupationSchema } from '../utils/validations/schema/professional/getProfessionalsByOccupationSchema';
import { authJwt } from '../utils/auth/jwt';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

router.post(
  '/add',
  validate(addProfessionalSchema),
  ProfessionalController.addProfessional
);

router.post(
  '/update',
  validate(updateProfessionalSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.updateProfessional
);

router.post(
  '/allowHealthInsurance',
  validate(allowForbidHealthInsuranceSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.allowHealthInsurance
);

router.post(
  '/forbidHealthInsurance',
  validate(allowForbidHealthInsuranceSchema),
  authJwt,
    authSelfAndRoleOrAdmin({
        role: UserRole.Professional,
        paramId: 'idProfessional',
        userField: 'professional',
    }),
  ProfessionalController.forbidHealthInsurance
);

router.get(
  '/getAll',
  authJwt,
  ProfessionalController.getProfessionals
);

router.get(
  '/getAllWithHealthInsurances',
  authJwt,
  ProfessionalController.getProfessionalsIncludeHealthInsurances
);

router.get(
  '/get/:idProfessional',
  validate(getDeleteProfessionalSchema),
  authJwt,
  ProfessionalController.getProfessional
);

router.get(
  '/getProfessionalsByOccupation/:idOccupation',
  validate(getProfessionalsByOccupationSchema),
  authJwt,
  ProfessionalController.getProfessionalsByOccupation
);

router.delete(
  '/delete/:idProfessional',
  validate(getDeleteProfessionalSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.deleteProfessional
);

export default router;
