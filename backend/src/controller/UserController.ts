import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../model/entities/User';
import { BaseHttpError, InvalidEmailFormatError, NotFoundError } from '../model/errors/BaseHttpError';
import { safeSerialize } from '../utils/safeSerialize';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superRefreshSecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10") //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';

const generateAccessToken = (id: number) => {
    const payload = { idUser: id }
    const options: SignOptions = { expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
}

const generateRefreshToken = (id: number) => {
    const payload = { idUser: id }
    const options: SignOptions = { expiresIn: REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, REFRESH_SECRET, options);
}
export class UserController {

    // LOGIN
    static async login(req: Request, res: Response) {
        try {
            const em = (await getORM()).em.fork();
            const { mail, password } = req.body;
            if (!mail || !password) {
                return res.status(400).json({ error: 'Email o contraseña incorrecta' });
            }
            const user = await em.findOne(User, { mail }, { populate: ['patient', 'professional', 'legalGuardian'] }); 
            if (!user) return res.status(404).json({ error: 'User no encontrado' }); //Deberia ser un NotFoundError quizas

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).json({ error: 'Credenciales Invalidos' });

            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            res.cookie('refreshToken', refreshToken, { //Guarda el refresh token de manera que no se pueda leer en el front pero que lo pueda utilizar para refrescar
                httpOnly: true,
                secure: false, // No usamos HTTPS
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
            });
            res.json({ user: safeSerialize(user), accessToken });
        } 
        catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    //REFRESH
    static async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ error: 'No se encontró refresh token. Por favor loguearse nuevamente' });
            }

            const payload = jwt.verify(refreshToken, REFRESH_SECRET as jwt.Secret) as { idUser: number };

            if(!payload || !payload.idUser) {
                return res.status(403).json({ error: 'Refresh token inválido' });
            }

            const em = (await getORM()).em.fork();
            const user = await em.findOne(User, { id: payload.idUser });

            if (!user || !user.isActive) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const accessToken = generateAccessToken(payload.idUser);
            res.json({ user: safeSerialize(user), accessToken });

        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ error: 'Refresh token expirado. Por favor loguearse nuevamente' });
            }
            res.status(500).json({ error: err.message });
        }
    }

    //LOGOUR
    static async logout(req: Request, res: Response) {
        try {
            res.clearCookie('refreshToken', {
            httpOnly: true,  // sigue protegiendo la cookie
            secure: false,   // en producción con HTTPS poner true
            sameSite: 'strict',
            });
            res.json({ message: 'Logout exitoso' });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    // UPDATE USER
    static async updatePassword(req: Request, res: Response) {
            try {
                const { password } = req.body;

                if(!password) {
                    return res.status(400).json({ message: 'Se requiere la nueva contraseña del usuario' });
                }

                const em = (await getORM()).em.fork();
                const user = await em.findOne(User, { id: Number(req.params.id) });
                
                if (!user|| !user?.isActive) {
                    throw new NotFoundError('Usuario');
                }

                user.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
                await em.flush();
                res.json(safeSerialize(user));
        } 
        catch (error){
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    res.status(500).json({ message: 'Error al actualizar el usuario' });
                }
        }
    }

    // DELETE USER Se hace desde el controlador de la persona especifica


    // SACAR ESTE METODO O DEJARLO SOLO ADMIN
    static async getAll(req: Request, res: Response) {
        const em = (await getORM()).em.fork();
        const users = await em.find(User, {});
        res.json(users);
    }

    // SACAR ESTE METODO O DEJARLO SOLO ADMIN
    static async getOne(req: Request, res: Response) {
        const em = (await getORM()).em.fork();
        const user = await em.findOne(User, { id: Number(req.params.id) });
        if (!user||!user?.isActive) 
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
}