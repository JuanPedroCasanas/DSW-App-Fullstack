import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { BaseHttpError, InvalidPasswordError, InvalidTokenError } from '../utils/errors/BaseHttpError';

const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; //Es la edad maxima de la COOKIE, no el refresh token en si

export class UserController {

    //No hace falta safeSerialize porque trabajo con un DTO
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
                maxAge: REFRESH_MAX_AGE
            });

            return res.status(200).json({
                user: result.userDto,
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

            return res.status(200).json({
                user: result.userDto,
                accessToken: result.accessToken,
            });

        } catch (error) {
            //Limpio token vencido/corrupto
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false, //Para usar HTTP en vez e HTTPS, no es buena práctica pero no nos parece algo estricto en este TP
                sameSite: 'strict',
            });

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
                secure: false, //Para usar HTTP en vez e HTTPS, no es buena práctica pero no nos parece algo estricto en este TP
                sameSite: 'strict',
            });

            return res.status(200).json({ message: 'Logout exitoso' });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ message: "Error al intentar hacer un logout" });
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
