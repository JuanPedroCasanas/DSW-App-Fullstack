import express from 'express';
import { ConsultingRoomController } from '../controller/ConsultingRoomController';

const router = express.Router();

router.get('/', ConsultingRoomController.home);
router.post('/add', ConsultingRoomController.addConsultingRoom);
router.post('/update', ConsultingRoomController.updateConsultingRoom);
router.get('/getAll', ConsultingRoomController.getConsultingRooms);
router.get('/get/:id', ConsultingRoomController.getConsultingRoom);
router.delete('/delete/:id', ConsultingRoomController.deleteConsultingRoom);


export default router;
