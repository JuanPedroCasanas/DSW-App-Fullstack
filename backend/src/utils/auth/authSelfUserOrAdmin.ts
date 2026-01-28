import { Request, Response, NextFunction } from 'express';
import { User } from '../../model/entities/User';
import { UserRole } from '../enums/UserRole';

export const authSelfUserOrAdmin = (bodyField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'No se encontro un usuario autenticado' });
    }

    if (user.role === UserRole.Admin) {
      return next();
    }

    const targetId = Number(req.body[bodyField]);

    if (!targetId || user.id !== targetId) {
      return res.status(403).json({ message: 'Accion no autorizada' });
    }

    next();
  };
};
