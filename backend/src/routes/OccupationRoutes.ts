import express from 'express';
import { OccupationController } from '../controller/OccupationController';
import { validate } from '../utils/validations/validate';
import { addOccupationSchema } from '../utils/validations/schema/occupation/addOccupationSchema';
import { updateOccupationSchema } from '../utils/validations/schema/occupation/updateOccupationSchema';
import { getDeleteOccupationSchema } from '../utils/validations/schema/occupation/getDeleteOccupationSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

router.post(
  '/add',
  validate(addOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.addOccupation
);

router.post(
  '/update',
  validate(updateOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.updateOccupation
);

router.delete(
  '/delete/:idOccupation',
  validate(getDeleteOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.deleteOccupation
);

router.get(
  '/getAll',
  OccupationController.getOccupations
);

router.get(
  '/get/:idOccupation',
  validate(getDeleteOccupationSchema),
  OccupationController.getOccupation
);

export default router;
