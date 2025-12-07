import express from 'express';
import { ConsultingRoomController } from '../controller/ConsultingRoomController';
import { validate } from '../utils/validations/validate';
import { addConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/addConsultingRoomSchema';
import { updateConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/updateConsultingRoomSchema';
import { getDeleteConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/getDeleteConsultingRoomSchema';
const router = express.Router();

router.post('/add', validate(addConsultingRoomSchema), ConsultingRoomController.addConsultingRoom);
router.post('/update', validate(updateConsultingRoomSchema), ConsultingRoomController.updateConsultingRoom);
router.get('/getAll', ConsultingRoomController.getConsultingRooms);
router.get('/get/:idConsultingRoom', validate(getDeleteConsultingRoomSchema), ConsultingRoomController.getConsultingRoom);router.delete('/delete/:idConsultingRoom', validate(getDeleteConsultingRoomSchema), ConsultingRoomController.deleteConsultingRoom);


export default router;
