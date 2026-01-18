import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { BaseHttpError, InvalidPasswordError } from '../utils/errors/BaseHttpError';

export class UserController {

    //No hace falta safeSerialize porque trabajo con un DTO
    static async login(req: Request, res: Response) {
        try {
            const { mail, password } = req.body;

            const result = await UserService.login(mail, password);

            return res.status(200).json({
                user: result.userDto,
                accessToken: result.accessToken,
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al realizar login' });
        }
    }

    static async updatePassword(req: Request, res: Response) {
        try {
            const { idUser, oldPassword, newPassword } = req.body;

            const result = await UserService.updatePassword(
                Number(idUser),
                oldPassword,
                newPassword
            );

            if (result === false) {
                throw new InvalidPasswordError("La contraseña actual ingresada no es valida")
            }

            return res.status(200).json({
                message: 'Contraseña cambiada exitosamente para: ',
                user: result,
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    }

    static async getAll(req: Request, res: Response) {
        const includeInactive =
            req.query.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const users = await UserService.getAll(includeInactive);
            return res.status(200).json(users);
        } catch {
            return res.status(500).json({ message: 'Error buscar usuarios' });
        }
    }

    static async getOne(req: Request, res: Response) {
        const idUser = Number(req.params.id);

        if (!idUser) {
            return res.status(404).json({ message: 'Se requiere la id del usuario a buscar' });
        }

        try {
            const user = await UserService.getOne(idUser);
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error buscar el usuario' });
        }
    }
}
