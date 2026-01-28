import express from 'express';
import { LegalGuardianController } from '../controller/LegalGuardianController';
import { validate } from '../utils/validations/validate';
import { addLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/addLegalGuardianSchema';
import { updateLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/updateLegalGuardianSchema';
import { getDeleteLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/getDeleteLegalGuardianSchema';
import { authJwt } from '../utils/auth/jwt';
import { UserRole } from '../utils/enums/UserRole';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';

const router = express.Router();

router.post(
  '/add',
  validate(addLegalGuardianSchema),
  LegalGuardianController.addLegalGuardian
);

router.post(
  '/update',
  validate(updateLegalGuardianSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.LegalGuardian,
    paramId: 'idLegalGuardian',
    userField: 'legalGuardian',
  }),
  LegalGuardianController.updateLegalGuardian
);

router.delete(
  '/delete/:idLegalGuardian',
  validate(getDeleteLegalGuardianSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.LegalGuardian,
    paramId: 'idLegalGuardian',
    userField: 'legalGuardian',
  }),
  LegalGuardianController.deleteLegalGuardian
);

router.get(
  '/getAll',
  authJwt,
  LegalGuardianController.getLegalGuardians
);

router.get(
  '/get/:idLegalGuardian',
  validate(getDeleteLegalGuardianSchema),
  authJwt,
  LegalGuardianController.getLegalGuardian
);

export default router;
