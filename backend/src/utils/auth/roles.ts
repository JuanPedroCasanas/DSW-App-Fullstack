import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/UserRole';
import { User } from '../../model/entities/User';


export const authRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: 'No se encontro un usuario autenticado' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }

    next();
  };
};
