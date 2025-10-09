import { User } from "../model/entities/User";
import bcrypt from 'bcrypt';
import { getORM } from "../orm/db";
import { EmailAlreadyExistsError, InvalidEmailFormatError } from "../model/errors/BaseHttpError";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? "10") //Los env son strings, parseo por las dudas y si no esta definido defaulteo a 10


export const createUser = async (mail: string, password: string) => {

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        throw new InvalidEmailFormatError(mail)
    }

    const em = await getORM().em.fork();
    const existingUser = await em.findOne(User, { mail: mail })
    
    if(existingUser) {
        throw new EmailAlreadyExistsError(mail);
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User(mail, hashedPassword);
    return user;
}