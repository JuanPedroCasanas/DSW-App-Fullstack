import express from 'express';
import { HealthInsuranceController } from '../controller/HealthInsuranceController';
import { validate } from '../utils/validations/validate';
import { addHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/addHealthInsuranceSchema';
import { updateHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/updateHealthInsuranceSchema';
import { getByProfessionalHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getByProfessionalHealthInsuranceSchema';
import { getDeleteHealthInsuranceSchema } from '../utils/validations/schema/healthInsurance/getDeleteHealthInsuranceSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

/**
 * @swagger
 * /healthInsurance/add:
 *   post:
 *     summary: Agregar una nueva Obra Social
 *     tags: [Obras Sociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "OSDE"
 *     responses:
 *       201:
 *         description: Obra Social creada exitosamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 */
router.post(
  '/add',
  validate(addHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.addHealthInsurance
);

/**
 * @swagger
 * /healthInsurance/update:
 *   post:
 *     summary: Modificar una Obra Social existente
 *     tags: [Obras Sociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la Obra Social a editar
 *               name:
 *                 type: string
 *                 example: "OSDE 210"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Actualizada correctamente
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Obra social no encontrada
 */
router.post(
  '/update',
  validate(updateHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.updateHealthInsurance
);

/**
 * @swagger
 * /healthInsurance/delete/{idHealthInsurance}:
 *   delete:
 *     summary: Eliminar una Obra Social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: idHealthInsurance
 *         required: true
 *         description: ID de la Obra Social a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra Social eliminada correctamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 *       404:
 *         description: Obra Social no encontrada
 */
router.delete(
  '/delete/:idHealthInsurance',
  validate(getDeleteHealthInsuranceSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  HealthInsuranceController.deleteHealthInsurance
);

/**
 * @swagger
 * /healthInsurance/getAll:
 *   get:
 *     summary: Obtener lista de todas las Obras Sociales
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 */
router.get(
  '/getAll',
  HealthInsuranceController.getAllHealthInsurances
);

/**
 * @swagger
 * /healthInsurance/get/{idHealthInsurance}:
 *   get:
 *     summary: Obtener una Obra Social por ID
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: idHealthInsurance
 *         required: true
 *         description: ID de la Obra Social a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra Social encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Obra Social no encontrada
 */
router.get(
  '/get/:idHealthInsurance',
  validate(getDeleteHealthInsuranceSchema),
  HealthInsuranceController.getHealthInsurance
);

/**
 * @swagger
 * /healthInsurance/getHealthInsurancesByProfessional/{idProfessional}:
 *   get:
 *     summary: Listar Obras Sociales aceptadas por un Profesional
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: idProfessional
 *         required: true
 *         description: ID del profesional a consultar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras sociales encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       404:
 *         description: Profesional no encontrado
 */
router.get(
  '/getHealthInsurancesByProfessional/:idProfessional',
  validate(getByProfessionalHealthInsuranceSchema),
  HealthInsuranceController.getHealthInsuranceByProfessional
);

export default router;
