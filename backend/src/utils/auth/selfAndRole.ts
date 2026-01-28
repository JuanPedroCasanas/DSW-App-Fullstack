import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/UserRole';
import { User } from '../../model/entities/User';

type Options = {
  role: UserRole;
  paramId: string; // name of the field (same for param or body)
  userField: 'professional' | 'patient' | 'legalGuardian';
};

export const authSelfAndRoleOrAdmin = (options: Options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'No se encontro un usuario autenticado' });
    }

    if (user.role === UserRole.Admin) {
      return next();
    }

    if (user.role !== options.role) {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }

    const targetId =
      Number(req.params[options.paramId]) ||
      Number(req.body[options.paramId]);

    if (!targetId) {
      return res.status(400).json({ message: 'ID objetivo no proporcionado' });
    }

    const entity = user[options.userField];

    if (!entity) {
      return res.status(403).json({ message: 'Entidad no asociada al usuario' });
    }

    if (entity.id !== targetId) {
      return res.status(403).json({ message: 'Accion no autorizada' });
    }

    next();
  };
};

