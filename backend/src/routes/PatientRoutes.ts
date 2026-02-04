import express from 'express';
import { PatientController } from '../controller/PatientController';
import { validate } from '../utils/validations/validate';
import { addIndPatientSchema } from '../utils/validations/schema/patient/addIndPatientSchema';
import { updateDepPatientSchema } from '../utils/validations/schema/patient/updateDepPatientSchema';
import { addDepPatientSchema } from '../utils/validations/schema/patient/addDepPatientSchema';
import { updateIndPatientSchema } from '../utils/validations/schema/patient/updateIndPatientSchema';
import { getDeletePatientSchema } from '../utils/validations/schema/patient/getDeletePatientSchema';
import { getByLegalGuardianPatientSchema } from '../utils/validations/schema/patient/getByLegalGuardianPatientSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';
import { UserRole } from '../utils/enums/UserRole';
import { authOwnedDependentPatientOrAdmin } from '../utils/auth/authOwnedDependentPatientOrAdmin';

const router = express.Router();

/**
 * @swagger
 * /patient/addIndPatient:
 *   post:
 *     summary: Registrar un Paciente Independiente (Sin Responsable Legal)
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "María"
 *               lastName:
 *                 type: string
 *                 example: "Gómez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               telephone:
 *                 type: string
 *                 example: "3411234567"
 *               idHealthInsurance:
 *                 type: integer
 *                 description: ID de la Obra Social
 *                 example: 1
 *     responses:
 *       201:
 *         description: Paciente registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/addIndPatient',
  validate(addIndPatientSchema),
  PatientController.addIndependentPatient
);

/**
 * @swagger
 * /patient/addDepPatient:
 *   post:
 *     summary: Registrar un Paciente Dependiente (Con Responsable Legal)
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Pedrito"
 *               lastName:
 *                 type: string
 *                 example: "Gómez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "2015-08-20"
 *               telephone:
 *                 type: string
 *                 example: "3411234567"
 *               idHealthInsurance:
 *                 type: integer
 *                 example: 1
 *               idLegalGuardian:
 *                 type: integer
 *                 description: ID del Responsable Legal responsable (Obligatorio si es Admin)
 *                 example: 5
 *     responses:
 *       201:
 *         description: Paciente dependiente registrado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No tienes permiso (Requiere Admin o Responsable Legal)
 */
router.post(
  '/addDepPatient',
  validate(addDepPatientSchema),
  authJwt,
  authRoles([UserRole.Admin, UserRole.LegalGuardian]),
  PatientController.addDependentPatient
);

/**
 * @swagger
 * /patient/updateDepPatient:
 *   post:
 *     summary: Modificar datos de un Paciente Dependiente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPatient:
 *                 type: integer
 *                 description: ID del paciente a editar (Requerido para seguridad)
 *                 example: 10
 *               firstName:
 *                 type: string
 *                 example: "Pedrito Editado"
 *               lastName:
 *                 type: string
 *                 example: "Gómez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "2015-08-20"
 *               telephone:
 *                 type: string
 *                 example: "3419999999"
 *               idHealthInsurance:
 *                 type: integer
 *                 example: 2
 *             responses:
 *               200:
 *                 description: Datos actualizados correctamente
 *               403:
 *                 description: No tienes permiso sobre este paciente (Solo el Responsable Legal asignado o Admin)
 *               404:
 *                 description: Paciente no encontrado
 */
router.post(
  '/updateDepPatient',
  validate(updateDepPatientSchema),
  authJwt,
  authOwnedDependentPatientOrAdmin({ patientIdField: 'idPatient' }),
  PatientController.updateDependentPatient
);

/**
 * @swagger
 * /patient/updateIndPatient:
 *   post:
 *     summary: Modificar datos de un Paciente Independiente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPatient:
 *                 type: integer
 *                 description: ID del paciente a editar (Debe ser el usuario actual o Admin)
 *                 example: 15
 *               firstName:
 *                 type: string
 *                 example: "María Editada"
 *               lastName:
 *                 type: string
 *                 example: "Gómez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               telephone:
 *                 type: string
 *                 example: "3419998888"
 *               idHealthInsurance:
 *                 type: integer
 *                 example: 2
 *             responses:
 *               200:
 *                 description: Datos actualizados correctamente
 *               403:
 *                 description: No tienes permiso (Solo el mismo Paciente o Admin)
 *               404:
 *                 description: Paciente no encontrado
 */
router.post(
  '/updateIndPatient',
  validate(updateIndPatientSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Patient,
    paramId: 'idPatient',
    userField: 'patient',
  }),
  PatientController.updateIndependentPatient
);

/**
 * @swagger
 * /patient/getAll:
 *   get:
 *     summary: Obtener lista de todos los Pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                   telephone:
 *                     type: string
 *                   healthInsurance:
 *                     type: object
 *                   legalGuardian:
 *                     type: object
 *                     nullable: true
 *               403:
 *                 description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  PatientController.getPatients
);

/**
 * @swagger
 * /patient/get/{idPatient}:
 *   get:
 *     summary: Obtener un Paciente por ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: idPatient
 *         required: true
 *         description: ID del paciente a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                 healthInsurance:
 *                   type: object
 *               403:
 *                 description: No tienes permiso
 *               404:
 *                 description: Paciente no encontrado
 */
router.get(
  '/get/:idPatient',
  validate(getDeletePatientSchema),
  authJwt,
  PatientController.getPatient
);

/**
 * @swagger
 * /patient/getByLegalGuardian/{idLegalGuardian}:
 *   get:
 *     summary: Listar Pacientes a cargo de un Responsable Legal
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: idLegalGuardian
 *         required: true
 *         description: ID del Responsable Legal
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pacientes encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   healthInsurance:
 *                     type: object
 *               403:
 *                 description: No tienes permiso
 *               404:
 *                 description: Responsable Legal no encontrado
 */
router.get(
  '/getByLegalGuardian/:idLegalGuardian',
  validate(getByLegalGuardianPatientSchema),
  authJwt,
  PatientController.getByLegalGuardian
);

/**
 * @swagger
 * /patient/delete/{idPatient}:
 *   delete:
 *     summary: Eliminar un Paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: idPatient
 *         required: true
 *         description: ID del paciente a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente eliminado correctamente
 *       403:
 *         description: No tienes permiso (Solo Admin o el Responsable Legal del paciente)
 *       404:
 *         description: Paciente no encontrado
 */
router.delete(
  '/delete/:idPatient',
  validate(getDeletePatientSchema),
  authJwt,
  authOwnedDependentPatientOrAdmin({ patientIdField: 'idPatient' }),
  PatientController.deletePatient
);

export default router;
