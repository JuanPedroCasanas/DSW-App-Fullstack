import { Request, Response, NextFunction } from 'express';
import { User } from '../../model/entities/User';
import { UserRole } from '../enums/UserRole';
import { getORM } from '../../orm/db';
import { Patient } from '../../model/entities/Patient';

type Options = {
  patientIdField: string;
};

export const authOwnedDependentPatientOrAdmin = (options: Options) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'No se encontro un usuario autenticado' });
    }

    if (user.role === UserRole.Admin) {
      return next();
    }

    if (user.role !== UserRole.LegalGuardian || !user.legalGuardian) {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }

    const patientId =
      Number(req.params[options.patientIdField]) ||
      Number(req.body[options.patientIdField]);

    if (!patientId) {
      return res.status(400).json({ message: 'ID de paciente no proporcionado' }); //No deberia saltar nunca porque lo agarra la validation antes
    }

    try {
      const em = (await getORM()).em.fork();

      const patient = await em.findOne(
        Patient,
        { id: patientId },
        { populate: ['legalGuardian'] }
      );

      if (!patient || !patient.legalGuardian) {
        return res.status(404).json({ message: 'Paciente no encontrado o no dependiente' });
      }

      if (patient.legalGuardian.id !== user.legalGuardian.id) {
        return res.status(403).json({ message: 'Accion no autorizada sobre este paciente' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
