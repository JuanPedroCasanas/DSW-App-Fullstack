import { User } from "../model/entities/User";
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;


export const createUser = async (mail: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User();
    user.mail = mail;
    user.password = hashedPassword;
    return user;
}