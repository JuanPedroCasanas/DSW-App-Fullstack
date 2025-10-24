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
const safeSerialize_1 = require("../utils/safeSerialize");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superRefreshSecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10"); //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';
const generateAccessToken = (id) => {
    const payload = { idUser: id };
    const options = { expiresIn: ACCESS_EXPIRES };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
const generateRefreshToken = (id) => {
    const payload = { idUser: id };
    const options = { expiresIn: REFRESH_EXPIRES };
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, options);
};
class UserController {
    // LOGIN
    static async login(req, res) {
        try {
            const em = (await (0, db_1.getORM)()).em.fork();
            const { mail, password } = req.body;
            if (!mail || !password) {
                return res.status(400).json({ error: 'Email o contraseña incorrecta' });
            }
            const user = await em.findOne(User_1.User, { mail }, { populate: ['patient', 'professional', 'legalGuardian'] });
            if (!user)
                return res.status(404).json({ error: 'User no encontrado' }); //Deberia ser un NotFoundError quizas
            const valid = await bcrypt_1.default.compare(password, user.password);
            if (!valid)
                return res.status(401).json({ error: 'Credenciales Invalidos' });
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // No usamos HTTPS
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
            });
            res.json({ user: (0, safeSerialize_1.safeSerialize)(user), accessToken });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    //REFRESH
    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ error: 'No se encontró refresh token. Por favor loguearse nuevamente' });
            }
            const payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
            if (!payload || !payload.idUser) {
                return res.status(403).json({ error: 'Refresh token inválido' });
            }
            const em = (await (0, db_1.getORM)()).em.fork();
            const user = await em.findOne(User_1.User, { id: payload.idUser });
            if (!user || !user.isActive) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const accessToken = generateAccessToken(payload.idUser);
            res.json({ user: (0, safeSerialize_1.safeSerialize)(user), accessToken });
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ error: 'Refresh token expirado. Por favor loguearse nuevamente' });
            }
            res.status(500).json({ error: err.message });
        }
    }
    //LOGOUR
    static async logout(req, res) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true, // sigue protegiendo la cookie
                secure: false, // en producción con HTTPS poner true
                sameSite: 'strict',
            });
            res.json({ message: 'Logout exitoso' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // UPDATE USER
    static async updatePassword(req, res) {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Se requiere la nueva contraseña del usuario' });
            }
            const em = (await (0, db_1.getORM)()).em.fork();
            const user = await em.findOne(User_1.User, { id: Number(req.params.id) });
            if (!user || !user?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Usuario');
            }
            user.password = await bcrypt_1.default.hash(req.body.password, SALT_ROUNDS);
            await em.flush();
            res.json((0, safeSerialize_1.safeSerialize)(user));
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
    // DELETE USER Se hace desde el controlador de la persona especifica
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
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map