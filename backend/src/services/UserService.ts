import { getORM } from '../orm/db';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../model/entities/User';
import { NotFoundError } from '../utils/errors/BaseHttpError';
import { toUserResponseDTO } from '../utils/dto/user/userResponseDto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10');
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';

const generateAccessToken = (id: number) => {
    const payload = { idUser: id };
    const options: SignOptions = { expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
};

export class UserService {

    static async login(mail: string, password: string) {
        const em = (await getORM()).em.fork();

        const user = await em.findOne(
            User,
            { mail: mail, isActive: true }, //Solo un usuario existe con un mail y estado activo a la vez.
            { populate: ['patient', 'professional', 'legalGuardian'] }
        );

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return false;
        }

        const userDto = toUserResponseDTO(user);

        return {
            userDto,
            accessToken: generateAccessToken(user.id),
        };
    }



    static async updatePassword(
        idUser: number,
        oldPassword: string,
        newPassword: string
    ) {
        const em = (await getORM()).em.fork();
        const user = await em.findOne(User, { id: idUser });

        if (!user || !user.isActive) {
            throw new NotFoundError('Usuario');
        }

        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) {
            return false;
        }
        
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await em.flush();

        const userDto = toUserResponseDTO(user);

        return userDto;
    }

    static async getAll(includeInactive: boolean) {
        const em = (await getORM()).em.fork();
        const whereCondition = includeInactive ? {} : { isActive: true };

        const users = await em.find(User, whereCondition, {
            populate: ['patient', 'professional', 'professional.occupation', 'legalGuardian'],
        });

        return users.map(toUserResponseDTO);
    }

    static async getOne(idUser: number) {
        const em = (await getORM()).em.fork();
        const user = await em.findOne(
            User,
            { id: idUser },
            { populate: ['patient', 'professional', 'legalGuardian'] }
        );

        if (!user || !user.isActive) {
            throw new NotFoundError('Usuario');
        }

        const userDto = toUserResponseDTO(user);

        return userDto;
    }
}
