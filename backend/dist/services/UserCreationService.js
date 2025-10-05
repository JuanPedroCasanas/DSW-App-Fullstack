"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const User_1 = require("../model/entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
const createUser = async (mail, password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const user = new User_1.User();
    user.mail = mail;
    user.password = hashedPassword;
    return user;
};
exports.createUser = createUser;
//# sourceMappingURL=UserCreationService.js.map