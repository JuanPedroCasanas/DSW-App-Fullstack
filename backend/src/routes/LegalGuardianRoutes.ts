import express from 'express';
import { LegalGuardianController } from '../controller/LegalGuardianController';
import { validate } from '../utils/validations/validate';
import { addLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/addLegalGuardianSchema';
import { updateLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/updateLegalGuardianSchema';
import { getDeleteLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/getDeleteLegalGuardianSchema';
import { authJwt } from '../utils/auth/jwt';
import { UserRole } from '../utils/enums/UserRole';
import { authSelfAndRoleOrAdmin } from '../utils/auth/selfAndRole';

const router = express.Router();

/**
 * @swagger
 * /legalGuardian/add:
 *   post:
 *     summary: Registrar un nuevo Tutor Legal
 *     tags: [Tutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-20"
 *               telephone:
 *                 type: string
 *                 example: "3415551234"
 *               idHealthInsurance:
 *                 type: integer
 *                 description: ID de la Obra Social
 *                 example: 1
 * responses:
 *   201:
 *     description: Tutor registrado exitosamente
 *   400:
 *     description: Datos inválidos
 */
router.post(
  '/add',
  validate(addLegalGuardianSchema),
  LegalGuardianController.addLegalGuardian
);

/**
 * @swagger
 * /legalGuardian/update:
 *   post:
 *     summary: Modificar datos de un Tutor Legal
 *     tags: [Tutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del tutor a editar
 *                 example: 1
 *               firstName:
 *                 type: string
 *                 example: "Juan Modificado"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-20"
 *               telephone:
 *                 type: string
 *                 example: "3415559999"
 *               idHealthInsurance:
 *                 type: integer
 *                 example: 2
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Datos actualizados correctamente
 *       403:
 *         description: No tienes permiso (Solo Admin o el mismo Tutor)
 *       404:
 *         description: Tutor no encontrado
 */
router.post(
  '/update',
  validate(updateLegalGuardianSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.LegalGuardian,
    paramId: 'idLegalGuardian',
    userField: 'legalGuardian',
  }),
  LegalGuardianController.updateLegalGuardian
);

/**
 * @swagger
 * /legalGuardian/delete/{idLegalGuardian}:
 *   delete:
 *     summary: Eliminar un Tutor Legal
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: idLegalGuardian
 *         required: true
 *         description: ID del tutor a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutor eliminado exitosamente
 *       403:
 *         description: No tienes permiso (Solo Admin o el mismo Tutor)
 *       404:
 *         description: Tutor no encontrado
 */
router.delete(
  '/delete/:idLegalGuardian',
  validate(getDeleteLegalGuardianSchema),
  authJwt,
  authSelfAndRoleOrAdmin({
    role: UserRole.LegalGuardian,
    paramId: 'idLegalGuardian',
    userField: 'legalGuardian',
  }),
  LegalGuardianController.deleteLegalGuardian
);

/**
 * @swagger
 * /legalGuardian/getAll:
 *   get:
 *     summary: Obtener lista de todos los Tutores Legales
 *     tags: [Tutores]
 *     responses:
 *       200:
 *         description: Lista de tutores obtenida correctamente
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
 *                   isActive:
 *                     type: boolean
 *       403:
 *         description: No tienes permiso
 */
router.get(
  '/getAll',
  authJwt,
  LegalGuardianController.getLegalGuardians
);

/**
 * @swagger
 * /legalGuardian/get/{idLegalGuardian}:
 *   get:
 *     summary: Obtener un Tutor Legal por ID
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: idLegalGuardian
 *         required: true
 *         description: ID del tutor a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: "Juan"
 *                 lastName:
 *                   type: string
 *                   example: "Pérez"
 *                 telephone:
 *                   type: string
 *                   example: "123456789"
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Tutor no encontrado
 */
router.get(
  '/get/:idLegalGuardian',
  validate(getDeleteLegalGuardianSchema),
  authJwt,
  LegalGuardianController.getLegalGuardian
);

export default router;
