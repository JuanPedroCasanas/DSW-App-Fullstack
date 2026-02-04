import express from 'express';
import { ConsultingRoomController } from '../controller/ConsultingRoomController';
import { validate } from '../utils/validations/validate';
import { addConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/addConsultingRoomSchema';
import { updateConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/updateConsultingRoomSchema';
import { getDeleteConsultingRoomSchema } from '../utils/validations/schema/consultingRoom/getDeleteConsultingRoomSchema';
import { UserRole } from '../utils/enums/UserRole';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';

const router = express.Router();
/**
 * @swagger
 * /consultingRoom/add:
 *   post:
 *     summary: Crear un nuevo consultorio
 *     tags: [Consultorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Consultorio 1 - Planta Baja"
 *     responses:
 *       201:
 *         description: Consultorio creado exitosamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 */
router.post(
  '/add',
  validate(addConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.addConsultingRoom
);

/**
 * @swagger
 * /consultingRoom/update:
 *   post:
 *     summary: Modificar un consultorio existente
 *     tags: [Consultorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del consultorio a editar
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Consultorio Modificado"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Consultorio actualizado correctamente
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Consultorio no encontrado
 */
router.post(
  '/update',
  validate(updateConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.updateConsultingRoom
);

/**
 * @swagger
 * /consultingRoom/delete/{idConsultingRoom}:
 *   delete:
 *     summary: Eliminar un consultorio (Baja lógica o física)
 *     tags: [Consultorios]
 *     parameters:
 *       - in: path
 *         name: idConsultingRoom
 *         required: true
 *         description: ID del consultorio a borrar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultorio eliminado exitosamente
 *       403:
 *         description: No tienes permiso (Requiere Admin)
 *       404:
 *         description: Consultorio no encontrado
 */
router.delete(
  '/delete/:idConsultingRoom',
  validate(getDeleteConsultingRoomSchema),
  authJwt,
  authRoles([UserRole.Admin]),
  ConsultingRoomController.deleteConsultingRoom
);

/**
 * @swagger
 * /consultingRoom/getAll:
 *   get:
 *     summary: Obtener lista de todos los consultorios
 *     tags: [Consultorios]
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
 *                   description:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  ConsultingRoomController.getConsultingRooms
);

/**
 * @swagger
 * /consultingRoom/get/{idConsultingRoom}:
 *   get:
 *     summary: Obtener un consultorio por su ID
 *     tags: [Consultorios]
 *     parameters:
 *       - in: path
 *         name: idConsultingRoom
 *         required: true
 *         description: ID del consultorio a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultorio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del consultorio
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Consultorio no encontrado
 */
router.get(
  '/get/:idConsultingRoom',
  validate(getDeleteConsultingRoomSchema),
  authJwt,
  ConsultingRoomController.getConsultingRoom
);

export default router;
