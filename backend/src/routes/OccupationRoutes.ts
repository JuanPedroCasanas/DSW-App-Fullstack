import express from 'express';
import { OccupationController } from '../controller/OccupationController';
import { validate } from '../utils/validations/validate';
import { addOccupationSchema } from '../utils/validations/schema/occupation/addOccupationSchema';
import { updateOccupationSchema } from '../utils/validations/schema/occupation/updateOccupationSchema';
import { getDeleteOccupationSchema } from '../utils/validations/schema/occupation/getDeleteOccupationSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

/**
 * @swagger
 * /occupation/add:
 *   post:
 *     summary: Agregar una nueva Ocupación (Profesión)
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la profesión
 *                 example: "Kinesiólogo"
 *     responses:
 *       201:
 *         description: Ocupación creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 */
router.post(
  '/add',
  validate(addOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.addOccupation
);

/**
 * @swagger
 * /occupation/update:
 *   post:
 *     summary: Modificar una Ocupación existente
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la profesión a editar
 *               name:
 *                 type: string
 *                 description: Nuevo nombre
 *                 example: "Kinesiólogo Deportivo"
 *     responses:
 *       200:
 *         description: Ocupación actualizada correctamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 *       404:
 *         description: Ocupación no encontrada
 */
router.post(
  '/update',
  validate(updateOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.updateOccupation
);

/**
 * @swagger
 * /occupation/delete/{idOccupation}:
 *   delete:
 *     summary: Eliminar una Ocupación
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: idOccupation
 *         required: true
 *         description: ID de la profesión a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ocupación eliminada correctamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 *       404:
 *         description: Ocupación no encontrada
 */
router.delete(
  '/delete/:idOccupation',
  validate(getDeleteOccupationSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  OccupationController.deleteOccupation
);

/**
 * @swagger
 * /occupation/getAll:
 *   get:
 *     summary: Obtener lista de todas las Ocupaciones
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de ocupaciones obtenida correctamente
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
 */
router.get(
  '/getAll',
  OccupationController.getOccupations
);

/**
 * @swagger
 * /occupation/get/{idOccupation}:
 *   get:
 *     summary: Obtener una Ocupación por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: idOccupation
 *         required: true
 *         description: ID de la profesión a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ocupación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Ocupación no encontrada
 */
router.get(
  '/get/:idOccupation',
  validate(getDeleteOccupationSchema),
  OccupationController.getOccupation
);

export default router;
