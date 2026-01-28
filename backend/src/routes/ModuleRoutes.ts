import express from 'express';
import ModuleController from '../controller/ModuleController';
import { validate } from '../utils/validations/validate';
import { addModuleSchema } from '../utils/validations/schema/module/addModuleSchema';
import { getModuleSchema } from '../utils/validations/schema/module/getModuleSchema';
import { getCurrentMonthModulesByConsultingRoomModuleSchema } from '../utils/validations/schema/module/getCurrentMonthModulesByConsultingRoomModuleSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

router.post(
  '/add',
  validate(addModuleSchema),
  authJwt,
  authRoles([UserRole.Professional, UserRole.Admin]),
  ModuleController.addModules
);

router.get(
  '/getAll',
  authJwt,
  ModuleController.getModules
);

router.get(
  '/get/:idModule',
  validate(getModuleSchema),
  authJwt,
  ModuleController.getModule
);

router.get(
  '/getCurrentMonthModulesByConsultingRoom/:idConsultingRoom',
  validate(getCurrentMonthModulesByConsultingRoomModuleSchema),
  authJwt,
  ModuleController.getCurrentMonthModulesByConsultingRoom
);

export default router;
