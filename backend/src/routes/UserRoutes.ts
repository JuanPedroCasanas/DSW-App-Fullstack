import express from 'express';
import { UserController } from '../controller/UserController';
import { validate } from '../utils/validations/validate';
import { loginSchema } from '../utils/validations/schema/user/loginSchema';
import { updatePasswordSchema } from '../utils/validations/schema/user/updatePasswordSchema';
import { authJwt } from '../utils/auth/jwt';
import { authRoles } from '../utils/auth/roles';
import { UserRole } from '../utils/enums/UserRole';
import { authSelfUserOrAdmin } from '../utils/auth/authSelfUserOrAdmin';

const router = express.Router();

/**
 * @swagger
 * /user/login:
 * post:
 * summary: Iniciar sesión
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: ¡Entraste correctamente!
 */
router.post(
  '/login',
  validate(loginSchema),
  UserController.login
);

/**
 * @swagger
 * /user/getAll:
 * get:
 * summary: Obtiene la lista de todos los usuarios registrados
 * description: Endpoint exclusivo para Administradores.
 * tags: [Usuarios]
 * responses:
 * 200:
 * description: Lista de usuarios obtenida exitosamente
 * 403:
 * description: Acceso denegado (Requiere rol de Admin)
 */
router.get(
  '/getAll',
  authJwt,
  authRoles([UserRole.Admin]),
  UserController.getAll
);

/**
 * @swagger
 * /user/get/{id}:
 * get:
 * summary: Obtiene el perfil de un usuario específico
 * description: Solo accesible para el propio usuario o un Admin.
 * tags: [Usuarios]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: El ID del usuario que quieres buscar
 * responses:
 * 200:
 * description: Perfil encontrado exitosamente
 * 403:
 * description: No tienes permiso (No eres el dueño de la cuenta ni Admin)
 * 404:
 * description: Usuario no encontrado
 */
router.get(
  '/get/:id',
  authJwt,
  authSelfUserOrAdmin('idUser'),
  UserController.getOne
);

/**
 * @swagger
 * /user/updatePassword:
 * post:
 * summary: Cambiar la contraseña del usuario
 * description: Permite al usuario (o un Admin) actualizar su clave.
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * idUser:
 * type: string
 * description: ID del usuario al que se le cambiará la clave
 * currentPassword:
 * type: string
 * description: La contraseña actual (por seguridad)
 * newPassword:
 * type: string
 * description: La nueva contraseña deseada
 * responses:
 * 200:
 * description: Contraseña actualizada correctamente
 * 400:
 * description: Datos inválidos (ej. contraseña muy corta)
 * 403:
 * description: No tienes permiso para cambiar esta contraseña
 */
router.post(
  '/updatePassword',
  validate(updatePasswordSchema),
  authJwt,
  authSelfUserOrAdmin('idUser'),
  UserController.updatePassword
);



export default router;
