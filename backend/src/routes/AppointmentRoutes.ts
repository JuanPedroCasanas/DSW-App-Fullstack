import express from 'express';
import { AppointmentController } from '../controller/AppointmentController';

const router = express.Router();

router.get('/', AppointmentController.home);
router.post('/add', AppointmentController.addAppointment);
router.post('/update', AppointmentController.updateAppointment);
router.get('/getAll', AppointmentController.getAppointments);
router.get('/get/:id', AppointmentController.getAppointment);
router.delete('/delete/:id', AppointmentController.deleteAppointment);


export default router;
