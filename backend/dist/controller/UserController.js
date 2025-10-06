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
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10"); //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10
class UserController {
    // LOGIN
    static async login(req, res) {
        try {
            const em = (await (0, db_1.getORM)()).em.fork();
            const { mail, password } = req.body;
            const user = await em.findOne(User_1.User, { mail });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            const valid = await bcrypt_1.default.compare(password, user.password);
            if (!valid)
                return res.status(401).json({ error: 'Invalid credentials' });
            const token = jsonwebtoken_1.default.sign({ idUser: user.idUser }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ user, token });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // GET ALL USERS
    static async getAll(req, res) {
        const em = (await (0, db_1.getORM)()).em.fork();
        const users = await em.find(User_1.User, {});
        res.json(users);
    }
    // GET ONE USER
    static async getOne(req, res) {
        const em = (await (0, db_1.getORM)()).em.fork();
        const user = await em.findOne(User_1.User, { idUser: Number(req.params.id) });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    // UPDATE USER
    static async update(req, res) {
        try {
            const em = (await (0, db_1.getORM)()).em.fork();
            const user = await em.findOne(User_1.User, { idUser: Number(req.params.id) });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            if (req.body.password) {
                req.body.password = await bcrypt_1.default.hash(req.body.password, SALT_ROUNDS);
            }
            em.assign(user, req.body);
            await em.persistAndFlush(user);
            res.json(user);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // DELETE USER
    static async delete(req, res) {
        const em = (await (0, db_1.getORM)()).em.fork();
        const user = await em.findOne(User_1.User, { idUser: Number(req.params.id) });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        await em.removeAndFlush(user);
        res.status(204).send();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map