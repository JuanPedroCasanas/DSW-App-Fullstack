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

router.get('/getAvailableAppointmentsByProfessional/:id', AppointmentController.getAvailableAppointmentsByProfessional);
router.get('/getScheduledAppointments', AppointmentController.getScheduledAppointments);

// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
router.get('/getAppointmentsByStatus', AppointmentController.getAppointmentsByStatus);

router.get('/getAppointmentsByPatient/:id', AppointmentController.getAppointmentsByPatient);

export default router;
