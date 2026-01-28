import express from 'express';
import { ConsultingRoomController } from '../controller/ConsultingRoomController';
import { validate } from '../utils/validations/validate';
import { addConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/addConsultingRoomSchema';
import { updateConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/updateConsultingRoomSchema';
import { getDeleteConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/getDeleteConsultingRoomSchema';
import { UserRole } from '../utils/enums/UserRole';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';

const router = express.Router();

router.post(
  '/add',
  validate(addConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.addConsultingRoom
);

router.post(
  '/update',
  validate(updateConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.updateConsultingRoom
);

router.delete(
  '/delete/:idConsultingRoom',
  validate(getDeleteConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.deleteConsultingRoom
);

router.get(
  '/getAll',
  authJwt,
  ConsultingRoomController.getConsultingRooms
);

router.get(
  '/get/:idConsultingRoom',
  validate(getDeleteConsultingRoomSchema),
  authJwt,
  ConsultingRoomController.getConsultingRoom
);

export default router;
