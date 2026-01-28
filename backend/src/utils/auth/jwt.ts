import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getORM } from '../../orm/db';
import { User } from '../../model/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const em = (await getORM()).em.fork();
        const user = await em.findOne(
            User,
            { id: payload.idUser },
            { populate: ['professional', 'patient', 'legalGuardian'] }
          );

        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export const authJwt = passport.authenticate('jwt', { session: false });
