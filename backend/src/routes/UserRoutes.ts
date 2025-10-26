import express from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserController } from '../controller/UserController';
import { User } from '../model/entities/User';
import { getORM } from '../orm/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const router = express.Router();

// Passport JWT Strategy
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

// Middleware to protect routes
const auth = passport.authenticate('jwt', { session: false });

// Routes

// Public
router.post('/login', (req, res) => UserController.login(req, res));

//Deberian ser protegidos, pero por ahora quedan publicos
router.get('/getAll', (req, res) => UserController.getAll(req, res));
router.get('/get/:id', (req, res) => UserController.getOne(req, res));
router.post('/updatePassword', (req, res) => UserController.updatePassword(req, res));

/* Protected asi quedarian al final, ademas de checkear roles
router.get('/users', auth, (req, res) => UserController.getAll(req, res));
router.get('/users/:id', auth, (req, res) => UserController.getOne(req, res));
router.post('/users/:id', auth, (req, res) => UserController.update(req, res));
*/
export default router;
