import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { BaseHttpError, ExpiredTokenError, InvalidPasswordError, InvalidTokenError } from '../model/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class UserController {

    static async login(req: Request, res: Response) {
        try {
            const { mail, password } = req.body;

            const result = await UserService.login(mail, password);

            if (result === null) {
                return res.status(404).json({ error: 'User no encontrado' });
            }

            if (result === false) {
                throw new InvalidPasswordError();
            }

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                user: safeSerialize(result.user),
                accessToken: result.accessToken,
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    }

    static async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            const result = await UserService.refresh(refreshToken);

            if (!result) {
                //Safeguard por las dudas, no debería entrar nunca en este bloque
                throw new InvalidTokenError();
            }

            return res.json({
                user: safeSerialize(result.user),
                accessToken: result.accessToken,
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });

            return res.json({ message: 'Logout exitoso' });
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
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

            return res.json({
                message: 'Contraseña cambiada exitosamente para: ',
                user: safeSerialize(result),
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
            return res.status(200).json(safeSerialize(users));
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
            return res.status(200).json(safeSerialize(user));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error buscar el usuario' });
        }
    }
}
