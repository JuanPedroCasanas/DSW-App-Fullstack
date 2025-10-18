"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const db_1 = require("../orm/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../model/entities/User");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10"); //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10
class UserController {
    // LOGIN
    static async login(req, res) {
        try {
            const em = (await (0, db_1.getORM)()).em.fork();
            const { mail, password } = req.body;
            if (!mail || !password) {
                return res.status(400).json({ error: 'Email o contraseña incorrecta' });
            }
            const user = await em.findOne(User_1.User, { mail });
            if (!user)
                return res.status(404).json({ error: 'User no encontrado' });
            const valid = await bcrypt_1.default.compare(password, user.password);
            if (!valid)
                return res.status(401).json({ error: 'Credenciales Invalidos' });
            const token = jsonwebtoken_1.default.sign({ idUser: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ user, token });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // SACAR ESTE METODO O DEJARLO SOLO ADMIN
    static async getAll(req, res) {
        const em = (await (0, db_1.getORM)()).em.fork();
        const users = await em.find(User_1.User, {});
        res.json(users);
    }
    // SACAR ESTE METODO O DEJARLO SOLO ADMIN
    static async getOne(req, res) {
        const em = (await (0, db_1.getORM)()).em.fork();
        const user = await em.findOne(User_1.User, { id: Number(req.params.id) });
        if (!user || !user?.isActive)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    // UPDATE USER
    static async update(req, res) {
        try {
            const { mail, password } = req.body;
            if (!mail) {
                return res.status(400).json({ message: 'Se requiere el nuevo email del usuario' });
            }
            if (!password) {
                return res.status(400).json({ message: 'Se requiere la nueva contraseña del usuario' });
            }
            const em = (await (0, db_1.getORM)()).em.fork();
            const user = await em.findOne(User_1.User, { id: Number(req.params.id) });
            if (!user || !user?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Usuario');
            }
            user.mail = mail;
            user.password = await bcrypt_1.default.hash(req.body.password, SALT_ROUNDS);
            await em.flush();
            res.json(user);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al actualizar el usuario' });
            }
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map