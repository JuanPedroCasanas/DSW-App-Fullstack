"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const User_1 = require("../model/entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../orm/db");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10"); //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10
const createUser = async (mail, password) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        throw new BaseHttpError_1.InvalidEmailFormatError(mail);
    }
    const em = await (0, db_1.getORM)().em.fork();
    const existingUser = await em.findOne(User_1.User, { mail: mail });
    if (existingUser) {
        throw new BaseHttpError_1.EmailAlreadyExistsError(mail);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const user = new User_1.User(mail, hashedPassword);
    return user;
};
exports.createUser = createUser;
//# sourceMappingURL=UserCreationService.js.map