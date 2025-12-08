import express from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserController } from '../controller/UserController';
import { User } from '../model/entities/User';
import { getORM } from '../orm/db';
import { validate } from '../utils/validations/validate';
import { loginSchema } from '../utils/validations/schema/user/loginSchema';
import { updatePasswordSchema } from '../utils/validations/schema/user/updatePasswordSchema';
import { refreshTokenSchema } from '../utils/validations/schema/user/refreshTokenSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; //Aun no implementado el secret en .ENV
const router = express.Router();


//Estrategia uqe usaremos al loguear
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const em = (await getORM()).em.fork();
        const user = await em.findOne(User, { id: payload.idUser });
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Middleware
const auth = passport.authenticate('jwt', { session: false });

// Routes

// Public
router.post('/login', validate(loginSchema), UserController.login);

//Deberian ser protegidos, pero por ahora quedan publicos
router.get('/getAll', UserController.getAll);
router.get('/get/:id', UserController.getOne);

router.post('/updatePassword', validate(updatePasswordSchema), UserController.updatePassword);

router.post('/refresh', validate(refreshTokenSchema), UserController.refresh);
router.delete('/logout', UserController.logout);

/* Protected asi quedarian al final, ademas de checkear roles
router.get('/users', auth, (req, res) => UserController.getAll(req, res));
router.get('/users/:id', auth, (req, res) => UserController.getOne(req, res));
router.post('/users/:id', auth, (req, res) => UserController.update(req, res));
*/
export default router;
