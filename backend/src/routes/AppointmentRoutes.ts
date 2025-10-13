import express from 'express';
import { AppointmentController } from '../controller/AppointmentController';

const router = express.Router();
//APLICAR AUTH A TODO ESTO, HAY QUE SER FINOS EN EL CANCEL, COMPLETE Y MISS
router.get('/', AppointmentController.home);
router.post('/assign', AppointmentController.assignAppointment);
router.post('/cancel', AppointmentController.cancelAppointment);
router.post('/complete', AppointmentController.completeAppointment);
router.post('/miss', AppointmentController.missAppointment);
router.get('/getAll', AppointmentController.getAppointments);
router.get('/get/:id', AppointmentController.getAppointment);


export default router;
