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
import { getByLegalGuardianAppointmentSchema } from '../utils/validations/schema/appointment/getByLegalGuardianAppointmentSchema';

const router = express.Router();

/**
 * @swagger
 * /appointment/assign:
 *   post:
 *     summary: Asignar/Reservar un turno para un paciente
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idAppointment:
 *                 type: integer
 *                 description: ID del turno disponible
 *               idPatient:
 *                 type: integer
 *                 description: ID del paciente
 *               idHealthInsurance:
 *                 type: integer
 *                 description: (Opcional) Obra social a utilizar
 *               idLegalGuardian:
 *                 type: integer
 *                 description: (Opcional) Tutor legal si aplica
 *     responses:
 *       200:
 *         description: Turno asignado exitosamente
 *       400:
 *         description: El turno ya está ocupado o datos inválidos
 *       403:
 *         description: No tienes permiso
 */
router.post(
  '/assign',
  validate(assignAppointmentSchema),
  authJwt,
  authRoles([UserRole.Patient, UserRole.LegalGuardian, UserRole.Admin]),
  AppointmentController.assignAppointment
);

/**
 * @swagger
 * /appointment/getAll:
 *   get:
 *     summary: Obtener lista de todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   professional:
 *                     type: object
 *                   patient:
 *                     type: object
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  AppointmentController.getAppointments
);

/**
 * @swagger
 * /appointment/get/{idAppointment}:
 *   get:
 *     summary: Obtener un turno específico por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: idAppointment
 *         required: true
 *         description: ID del turno a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 professional:
 *                   type: object
 *                 patient:
 *                   type: object
 *       404:
 *         description: Turno no encontrado
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/get/:idAppointment',
  validate(getCancelAppointmentSchema),
  authJwt,  
  AppointmentController.getAppointment
);

/**
 * @swagger
 * /appointment/getAvailableAppointmentsByProfessional/{idProfessional}:
 *   get:
 *     summary: Listar turnos disponibles de un profesional
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: idProfessional
 *         required: true
 *         description: ID del profesional a consultar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       404:
 *         description: Profesional no encontrado o sin turnos
 */
router.get(
  '/getAvailableAppointmentsByProfessional/:idProfessional',
  validate(getByProfessionalAppointmentSchema),
  authJwt,  
  AppointmentController.getAvailableAppointmentsByProfessional
);

/**
 * @swagger
 * /appointment/getScheduledAppointments:
 *   get:
 *     summary: Obtener mis turnos agendados (Confirmados)
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos agendados encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   professional:
 *                     type: object
 *                   patient:
 *                     type: object
 *       403:
 *         description: No tienes permiso (Requiere login)
 */
router.get(
  '/getScheduledAppointments',
  authJwt,
  AppointmentController.getScheduledAppointments
);

// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
/**
 * @swagger
 * /appointment/getAppointmentsByStatus:
 *   get:
 *     summary: Buscar turnos por estado (ej. PENDING, CONFIRMED)
 *     tags: [Turnos]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         description: Estado del turno a buscar
 *         schema:
 *           type: string
 *           example: "PENDING"
 *     responses:
 *       200:
 *         description: Lista de turnos encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       400:
 *         description: Estado inválido o faltante
 */
router.get(
  '/getAppointmentsByStatus',
  authJwt,
  AppointmentController.getAppointmentsByStatus
);

// funciona: /updateStatus?status=completed/missed/cancelled y todos los otros estados que tiene turno
/**
 * @swagger
 * /appointment/updateStatus:
 *   post:
 *     summary: Cambiar el estado de un turno (ej. CONFIRMED, CANCELLED)
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del turno a modificar
 *               status:
 *                 type: string
 *                 description: Nuevo estado (ej. CONFIRMED)
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Turno no encontrado
 */
router.post(
  '/updateStatus',
  validate(updateStatusAppointmentSchema),
  authJwt,  
  AppointmentController.updateAppointmentStatus
);

/**
 * @swagger
 * /appointment/getAppointmentsByPatient/{idPatient}:
 *   get:
 *     summary: Historial de turnos de un paciente específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: idPatient
 *         required: true
 *         description: ID del paciente a consultar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de turnos encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   professional:
 *                     type: object
 *       404:
 *         description: Paciente no encontrado
 */
router.get(
  '/getAppointmentsByPatient/:idPatient',
  validate(getByPatientAppointmentSchema),
  authJwt,  
  AppointmentController.getAppointmentsByPatient
);

/**
 * @swagger
 * /appointment/getAppointmentsByLegalGuardian/{idLegalGuardian}:
 *   get:
 *     summary: Historial de turnos de un Tutor Legal
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: idLegalGuardian
 *         required: true
 *         description: ID del tutor a consultar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turnos del tutor encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   patient:
 *                     type: object
 *       404:
 *         description: Tutor no encontrado
 */
router.get(
  '/getAppointmentsByLegalGuardian/:idLegalGuardian',
  validate(getByLegalGuardianAppointmentSchema),
  authJwt,
  AppointmentController.getAppointmentsByLegalGuardian
);


export default router;
