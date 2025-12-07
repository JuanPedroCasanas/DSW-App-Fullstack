import { getORM } from '../orm/db';
import { Occupation } from '../model/entities/Occupation';
import { NotFoundError } from '@mikro-orm/core';

export class OccupationService {

    static async addOccupation(name: string) {
        const em = await getORM().em.fork();

        const occupation = new Occupation(name);
        await em.persistAndFlush(occupation);

        return occupation;
    }

    static async updateOccupation(idOccupation: number, name: string) {
        const em = await getORM().em.fork();
        const occupation = await em.findOne(Occupation, { id: idOccupation });

        if (!occupation) {
            throw new NotFoundError('Especialidad');
        }

        occupation.name = name;
        await em.flush();

        return occupation;
    }

    static async getOccupation(idOccupation: number) {
        const em = await getORM().em.fork();
        const occupation = await em.findOne(Occupation, { id: idOccupation });

        if (!occupation) {
            throw new NotFoundError('Especialidad');
        }

        return occupation;
    }

    static async getOccupations() {
        const em = await getORM().em.fork();
        const occupations = await em.findAll(Occupation);

        return occupations;
    }

    static async deleteOccupation(idOccupation: number) {
        const em = await getORM().em.fork();
        const occupation = await em.findOne(Occupation, { id: idOccupation });

        if (!occupation) {
            throw new NotFoundError('Especialidad');
        }

        await em.removeAndFlush(occupation);

        return occupation;
    }
}
