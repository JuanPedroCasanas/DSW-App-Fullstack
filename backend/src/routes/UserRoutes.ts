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

router.post(
  '/login',
  validate(loginSchema),
  UserController.login
);

router.get(
  '/getAll',
  authJwt,
  authRoles([UserRole.Admin]),
  UserController.getAll
);

router.get(
  '/get/:id',
  authJwt,
  authSelfUserOrAdmin('idUser'),
  UserController.getOne
);

router.post(
  '/updatePassword',
  validate(updatePasswordSchema),
  authJwt,
  authSelfUserOrAdmin('idUser'),
  UserController.updatePassword
);



export default router;
