import express from 'express';
import { ProfessionalController } from '../controller/ProfessionalController';
import { addProfessionalSchema } from '../utils/validations/schema/professional/addProfessionalSchema';
import { validate } from '../utils/validations/validate';
import { updateProfessionalSchema } from '../utils/validations/schema/professional/updateProfessionalSchema';
import { allowForbidHealthInsuranceSchema } from '../utils/validations/schema/professional/allowForbidHealthInsuranceSchema';
import { getDeleteProfessionalSchema } from '../utils/validations/schema/professional/getDeleteProfessionalSchema';
import { getProfessionalsByOccupationSchema } from '../utils/validations/schema/professional/getProfessionalsByOccupationSchema';
import { authJwt } from '../utils/auth/jwt';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

/**
 * @swagger
 * /professional/add:
 *   post:
 *     summary: Registrar un nuevo Profesional
 *     tags: [Profesionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Roberto"
 *               lastName:
 *                 type: string
 *                 example: "Fernández"
 *               telephone:
 *                 type: string
 *                 example: "3414445555"
 *               idOccupation:
 *                 type: integer
 *                 description: ID de la profesión (ej. Médico, Kinesiólogo)
 *                 example: 1
 *               idsHealthInsurances:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs de Obras Sociales que atiende
 *                 example: [1, 3]
 *     responses:
 *       201:
 *         description: Profesional registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/add',
  validate(addProfessionalSchema),
  ProfessionalController.addProfessional
);

/**
 * @swagger
 * /professional/update:
 *   post:
 *     summary: Modificar datos de un Profesional
 *     tags: [Profesionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProfessional:
 *                 type: integer
 *                 description: ID del profesional a editar (Requerido para seguridad)
 *                 example: 5
 *               firstName:
 *                 type: string
 *                 example: "Roberto Editado"
 *               lastName:
 *                 type: string
 *                 example: "Fernández"
 *               telephone:
 *                 type: string
 *                 example: "3419999999"
 *               idOccupation:
 *                 type: integer
 *                 example: 2
 *               idsHealthInsurances:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista actualizada de IDs de Obras Sociales
 *                 example: [1, 2, 3]
 *             responses:
 *               200:
 *                 description: Datos actualizados correctamente
 *               403:
 *                 description: No tienes permiso (Solo el mismo Profesional o Admin)
 *               404:
 *                 description: Profesional no encontrado
 */
router.post(
  '/update',
  validate(updateProfessionalSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.updateProfessional
);

/**
 * @swagger
 * /professional/allowHealthInsurance:
 *   post:
 *     summary: Agregar una Obra Social a la lista de admitidas
 *     tags: [Profesionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProfessional:
 *                 type: integer
 *                 description: ID del profesional (Requerido para seguridad)
 *                 example: 5
 *               idHealthInsurance:
 *                 type: integer
 *                 description: ID de la obra social a agregar (ej. IAPOS, OSDE)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Obra social agregada correctamente
 *       403:
 *         description: No tienes permiso (Solo el mismo Profesional o Admin)
 *       404:
 *         description: Profesional u Obra Social no encontrados
 */
router.post(
  '/allowHealthInsurance',
  validate(allowForbidHealthInsuranceSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.allowHealthInsurance
);

/**
 * @swagger
 * /professional/forbidHealthInsurance:
 *   post:
 *     summary: Dejar de atender por una Obra Social (Eliminar relación)
 *     tags: [Profesionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProfessional:
 *                 type: integer
 *                 description: ID del profesional (Requerido para seguridad)
 *                 example: 5
 *               idHealthInsurance:
 *                 type: integer
 *                 description: ID de la obra social a eliminar
 *                 example: 3
 *     responses:
 *       200:
 *         description: Obra social eliminada de la lista del profesional
 *       403:
 *         description: No tienes permiso (Solo el mismo Profesional o Admin)
 *       404:
 *         description: Relación no encontrada
 */
router.post(
  '/forbidHealthInsurance',
  validate(allowForbidHealthInsuranceSchema),
  authJwt,
    authSelfAndRoleOrAdmin({
        role: UserRole.Professional,
        paramId: 'idProfessional',
        userField: 'professional',
    }),
  ProfessionalController.forbidHealthInsurance
);

/**
 * @swagger
 * /professional/getAll:
 *   get:
 *     summary: Obtener lista de todos los Profesionales
 *     tags: [Profesionales]
 *     responses:
 *       200:
 *         description: Lista de profesionales obtenida correctamente
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
 *                   telephone:
 *                     type: string
 *                   occupation:
 *                     type: object
 *                   healthInsurances:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  ProfessionalController.getProfessionals
);

/**
 * @swagger
 * /professional/getAllWithHealthInsurances:
 *   get:
 *     summary: Listar Profesionales incluyendo sus Obras Sociales
 *     tags: [Profesionales]
 *     responses:
 *       200:
 *         description: Lista completa con obras sociales obtenida
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
 *                   telephone:
 *                     type: string
 *                   occupation:
 *                     type: object
 *                   healthInsurances:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAllWithHealthInsurances',
  authJwt,
  ProfessionalController.getProfessionalsIncludeHealthInsurances
);

/**
 * @swagger
 * /professional/get/{idProfessional}:
 *   get:
 *     summary: Obtener un Profesional por ID
 *     tags: [Profesionales]
 *     parameters:
 *       - in: path
 *         name: idProfessional
 *         required: true
 *         description: ID del profesional a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profesional encontrado
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
 *                 telephone:
 *                   type: string
 *                 occupation:
 *                   type: object
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Profesional no encontrado
 */
router.get(
  '/get/:idProfessional',
  validate(getDeleteProfessionalSchema),
  authJwt,
  ProfessionalController.getProfessional
);

/**
 * @swagger
 * /professional/getProfessionalsByOccupation/{idOccupation}:
 *   get:
 *     summary: Buscar Profesionales por su Ocupación (Especialidad)
 *     tags: [Profesionales]
 *     parameters:
 *       - in: path
 *         name: idOccupation
 *         required: true
 *         description: ID de la profesión a buscar (ej. 1 para Kinesiólogo)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de profesionales encontrada
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
 *                   telephone:
 *                     type: string
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getProfessionalsByOccupation/:idOccupation',
  validate(getProfessionalsByOccupationSchema),
  authJwt,
  ProfessionalController.getProfessionalsByOccupation
);

/**
 * @swagger
 * /professional/delete/{idProfessional}:
 *   delete:
 *     summary: Eliminar un Profesional (Dar de baja)
 *     tags: [Profesionales]
 *     parameters:
 *       - in: path
 *         name: idProfessional
 *         required: true
 *         description: ID del profesional a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profesional eliminado correctamente
 *       403:
 *         description: No tienes permiso (Solo el mismo Profesional o Admin)
 *       404:
 *         description: Profesional no encontrado
 */
router.delete(
  '/delete/:idProfessional',
  validate(getDeleteProfessionalSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.Professional,
    paramId: 'idProfessional',
    userField: 'professional',
  }),
  ProfessionalController.deleteProfessional
);

export default router;
