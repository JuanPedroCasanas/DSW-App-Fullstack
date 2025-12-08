import { getORM } from '../orm/db';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../model/entities/User';
import { ExpiredTokenError, InvalidTokenError, NotFoundError } from '../utils/errors/BaseHttpError';
import { toUserResponseDTO } from '../utils/dto/user/userResponseDto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superRefreshSecret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10');
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';

const generateAccessToken = (id: number) => {
    const payload = { idUser: id };
    const options: SignOptions = { expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
};

const generateRefreshToken = (id: number) => {
    const payload = { idUser: id };
    const options: SignOptions = { expiresIn: REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, REFRESH_SECRET, options);
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
            refreshToken: generateRefreshToken(user.id),
        };
    }


    static async refresh(refreshToken: string | undefined) {
        if (!refreshToken) {
            throw new InvalidTokenError();
        }

        let payload: any;

        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET) as { idUser: number };
        } catch (error: any) {
            
            if (error.name === 'TokenExpiredError') {
                throw new ExpiredTokenError();
            }
            throw new InvalidTokenError();
        }

        const em = (await getORM()).em.fork();
        const user = await em.findOne(User, 
            { id: payload.idUser, isActive: true }, 
            { populate: ['patient', 'professional', 'legalGuardian'] });

        if (!user || !user.isActive) {
            throw new NotFoundError('Usuario');
        }

        const accessToken = generateAccessToken(user.id);
        const userDto = toUserResponseDTO(user);

        return { userDto, accessToken };
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
