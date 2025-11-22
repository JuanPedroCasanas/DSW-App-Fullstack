import express from 'express';
import { AppointmentController } from '../controller/AppointmentController';
import { validate } from '../utils/validations/validate';
import { assignAppointmentSchema } from '../utils/validations/schema/appointment/assignAppointmentSchema';
import { getCancelCompleteMissAppointmentSchema } from '../utils/validations/schema/appointment/getCancelCompleteMissAppointmentSchema';
import { getByProfessionalAppointmentSchema } from '../utils/validations/schema/appointment/getByProfessionalAppointmentSchema';
import { getByPatientAppointmentSchema } from '../utils/validations/schema/appointment/getByPatientAppointmentSchema';

const router = express.Router();
//APLICAR AUTH A TODO ESTO, HAY QUE SER FINOS EN EL CANCEL, COMPLETE Y MISS
router.get('/', AppointmentController.home);
router.post('/assign', validate(assignAppointmentSchema), AppointmentController.assignAppointment);
router.post('/cancel', validate(getCancelCompleteMissAppointmentSchema), AppointmentController.cancelAppointment);
router.post('/complete', validate(getCancelCompleteMissAppointmentSchema), AppointmentController.completeAppointment);
router.post('/miss', validate(getCancelCompleteMissAppointmentSchema), AppointmentController.missAppointment);
router.get('/getAll', AppointmentController.getAppointments);
router.get('/get/:idAppointment', validate(getCancelCompleteMissAppointmentSchema), AppointmentController.getAppointment);

router.get('/getAvailableAppointmentsByProfessional/:idProfessional', validate(getByProfessionalAppointmentSchema),AppointmentController.getAvailableAppointmentsByProfessional);
router.get('/getScheduledAppointments', AppointmentController.getScheduledAppointments);

// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
router.get('/getAppointmentsByStatus', AppointmentController.getAppointmentsByStatus);

router.get('/getAppointmentsByPatient/:idPatient', validate(getByPatientAppointmentSchema), AppointmentController.getAppointmentsByPatient);

export default router;
