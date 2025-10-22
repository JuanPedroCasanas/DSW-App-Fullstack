import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../model/entities/User';
import { BaseHttpError, InvalidEmailFormatError, NotFoundError } from '../model/errors/BaseHttpError';
import { safeSerialize } from '../utils/safeSerialize';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { Professional } from '../model/entities/Professional';
import { Patient } from '../model/entities/Patient';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10") //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10

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

            let person: Patient | LegalGuardian | Professional | undefined;

            const token = jwt.sign({ idUser: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ user: safeSerialize(user) ,token });
        } 
        catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

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

    // UPDATE USER
    static async update(req: Request, res: Response) {
            try {
                const { mail, password } = req.body;

                if (!mail) {
                    return res.status(400).json({ message: 'Se requiere el nuevo email del usuario' });
                }

                if(!password) {
                    return res.status(400).json({ message: 'Se requiere la nueva contraseña del usuario' });
                }

                const em = (await getORM()).em.fork();
                const user = await em.findOne(User, { id: Number(req.params.id) });
                
                if (!user|| !user?.isActive) {
                    throw new NotFoundError('Usuario');
                }

                user.mail = mail;
                user.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);

                await em.flush();

                res.json(user);

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
}