import express from 'express';
import ModuleController from '../controller/ModuleController';
import { validate } from '../utils/validations/validate';
import { addModuleSchema } from '../utils/validations/schema/module/addModuleSchema';
import { getModuleSchema } from '../utils/validations/schema/module/getModuleSchema';
import { getCurrentMonthModulesByConsultingRoomModuleSchema } from '../utils/validations/schema/module/getCurrentMonthModulesByConsultingRoomModuleSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';

const router = express.Router();

/**
 * @swagger
 * /module/add:
 *   post:
 *     summary: Crear un nuevo Módulo (Horario de atención)
 *     tags: [Módulos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 description: Día de la semana (Monday, Tuesday, etc.)
 *                 example: "Monday"
 *               startTime:
 *                 type: string
 *                 description: Hora de inicio en formato 24hs (HH:mm)
 *                 example: "14:30"
 *               validMonth:
 *                 type: integer
 *                 description: Mes de vigencia
 *                 example: 2
 *               validYear:
 *                 type: integer
 *                 description: Año de vigencia
 *                 example: 2026
 *               idProfessional:
 *                 type: integer
 *                 description: ID del profesional que atenderá
 *                 example: 1
 *               idConsultingRoom:
 *                 type: integer
 *                 description: ID del consultorio asignado
 *                 example: 3
 *               idModuleType:
 *                 type: integer
 *                 description: ID del tipo de módulo (Esto define la duración y hora fin)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Módulo creado exitosamente
 *       400:
 *         description: Datos inválidos o solapamiento de horarios
 *       403:
 *         description: No tienes permiso (Requiere Admin o Profesional)
 */
router.post(
  '/add',
  validate(addModuleSchema),
  authJwt,
  authRoles([UserRole.Professional, UserRole.Admin]),
  ModuleController.addModules
);

/**
 * @swagger
 * /module/getAll:
 *   get:
 *     summary: Obtener lista de todos los Módulos (Horarios)
 *     tags: [Módulos]
 *     responses:
 *       200:
 *         description: Lista de módulos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   day:
 *                     type: string
 *                     example: "Monday"
 *                   startTime:
 *                     type: string
 *                     example: "09:00"
 *                   endTime:
 *                     type: string
 *                     example: "10:00"
 *                   status:
 *                     type: string
 *                   professional:
 *                     type: object
 *                   moduleType:
 *                     type: object
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  ModuleController.getModules
);

/**
 * @swagger
 * /module/get/{idModule}:
 *   get:
 *     summary: Obtener un Módulo por ID
 *     tags: [Módulos]
 *     parameters:
 *       - in: path
 *         name: idModule
 *         required: true
 *         description: ID del módulo a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Módulo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 day:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                 endTime:
 *                   type: string
 *                 status:
 *                   type: string
 *                 professional:
 *                   type: object
 *                 moduleType:
 *                   type: object
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Módulo no encontrado
 */
router.get(
  '/get/:idModule',
  validate(getModuleSchema),
  authJwt,
  ModuleController.getModule
);

/**
 * @swagger
 * /module/getCurrentMonthModulesByConsultingRoom/{idConsultingRoom}:
 *   get:
 *     summary: Obtener módulos del mes actual por Consultorio
 *     tags: [Módulos]
 *     parameters:
 *       - in: path
 *         name: idConsultingRoom
 *         required: true
 *         description: ID del consultorio a filtrar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de módulos encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   day:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   professional:
 *                     type: object
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Consultorio no encontrado
 */
router.get(
  '/getCurrentMonthModulesByConsultingRoom/:idConsultingRoom',
  validate(getCurrentMonthModulesByConsultingRoomModuleSchema),
  authJwt,
  ModuleController.getCurrentMonthModulesByConsultingRoom
);

export default router;
