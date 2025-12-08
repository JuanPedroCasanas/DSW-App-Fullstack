import express from 'express';
import { AppointmentController } from '../controller/AppointmentController';
import { validate } from '../utils/validations/validate';
import { assignAppointmentSchema } from '../utils/validations/schema/appointment/assignAppointmentSchema';
import { getCancelAppointmentSchema } from '../utils/validations/schema/appointment/getCancelAppointmentSchema';
import { getByProfessionalAppointmentSchema } from '../utils/validations/schema/appointment/getByProfessionalAppointmentSchema';
import { updateStatusAppointmentSchema } from '../utils/validations/schema/appointment/updateStatusAppointmentSchema';
import { getByPatientAppointmentSchema } from '../utils/validations/schema/appointment/getByPatientAppointmentSchema';

const router = express.Router();
//APLICAR AUTH A TODO ESTO, HAY QUE SER FINOS EN EL CANCEL, COMPLETE Y MISS
router.post('/assign', validate(assignAppointmentSchema), AppointmentController.assignAppointment);



router.get('/getAll', AppointmentController.getAppointments);
router.get('/get/:idAppointment', validate(getCancelAppointmentSchema), AppointmentController.getAppointment);

router.get('/getAvailableAppointmentsByProfessional/:idProfessional', validate(getByProfessionalAppointmentSchema),AppointmentController.getAvailableAppointmentsByProfessional);
router.get('/getScheduledAppointments', AppointmentController.getScheduledAppointments);

// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
router.get('/getAppointmentsByStatus', AppointmentController.getAppointmentsByStatus);

// funciona: /updateStatus?status=completed/missed/cancelled y todos los otros estados que tiene turno
router.post('/updateStatus', validate(updateStatusAppointmentSchema), AppointmentController.updateAppointmentStatus);

router.get('/getAppointmentsByPatient/:idPatient', validate(getByPatientAppointmentSchema), AppointmentController.getAppointmentsByPatient);

export default router;
