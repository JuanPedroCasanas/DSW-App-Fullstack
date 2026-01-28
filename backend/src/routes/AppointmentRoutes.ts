import express from 'express';
import { AppointmentController } from '../controller/AppointmentController';
import { validate } from '../utils/validations/validate';
import { assignAppointmentSchema } from '../utils/validations/schema/appointment/assignAppointmentSchema';
import { getCancelAppointmentSchema } from '../utils/validations/schema/appointment/getCancelAppointmentSchema';
import { getByProfessionalAppointmentSchema } from '../utils/validations/schema/appointment/getByProfessionalAppointmentSchema';
import { updateStatusAppointmentSchema } from '../utils/validations/schema/appointment/updateStatusAppointmentSchema';
import { getByPatientAppointmentSchema } from '../utils/validations/schema/appointment/getByPatientAppointmentSchema';
import { authRoles } from '../utils/auth/roles';
import { authJwt } from '../utils/auth/jwt';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

router.post(
  '/assign',
  validate(assignAppointmentSchema),
  authJwt,
  authRoles([UserRole.Patient, UserRole.LegalGuardian, UserRole.Admin]),
  AppointmentController.assignAppointment
);


router.get(
  '/getAll',
  authJwt,
  AppointmentController.getAppointments
);

router.get(
  '/get/:idAppointment',
  validate(getCancelAppointmentSchema),
  authJwt,  
  AppointmentController.getAppointment
);

router.get(
  '/getAvailableAppointmentsByProfessional/:idProfessional',
  validate(getByProfessionalAppointmentSchema),
  authJwt,  
  AppointmentController.getAvailableAppointmentsByProfessional
);

router.get(
  '/getScheduledAppointments',
  authJwt,
  AppointmentController.getScheduledAppointments
);

// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
router.get(
  '/getAppointmentsByStatus',
  authJwt,
  AppointmentController.getAppointmentsByStatus
);

// funciona: /updateStatus?status=completed/missed/cancelled y todos los otros estados que tiene turno
router.post(
  '/updateStatus',
  validate(updateStatusAppointmentSchema),
  authJwt,  
  AppointmentController.updateAppointmentStatus
);


router.get(
  '/getAppointmentsByPatient/:idPatient',
  validate(getByPatientAppointmentSchema),
  authJwt,  
  AppointmentController.getAppointmentsByPatient
);

export default router;
