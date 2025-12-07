import { getORM } from '../orm/db';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';
import { Professional } from '../model/entities/Professional';

export class HealthInsuranceService {

    static async addHealthInsurance(name: string) {
        const em = await getORM().em.fork(); 
        const healthInsurance = new HealthInsurance(name);
        await em.persistAndFlush(healthInsurance);

        return healthInsurance;
    }

    static async updateHealthInsurance(idHealthInsurance: number, name: string) {
        const em = await getORM().em.fork();

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });

        if (!healthInsurance) {
            throw new NotFoundError('Obra Social');
        }

        healthInsurance.name = name;
        await em.flush();

        return healthInsurance;
    }

    static async getHealthInsurance(idHealthInsurance: number) {
        const em = await getORM().em.fork();
        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });

        if (!healthInsurance) {
            throw new NotFoundError('Obra Social');
        }

        return healthInsurance;
    }

    static async getAllHealthInsurances(includeInactive: boolean) {
        const em = await getORM().em.fork();
        const whereCondition = (includeInactive) ? {} : { isActive: true };
        const healthInsurances = await em.find(HealthInsurance, whereCondition);

        return healthInsurances;
    }

    static async getHealthInsuranceByProfessional(idProfessional: number, includeInactive: boolean) {
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, { id: idProfessional });

        if(!professional) {
            throw new NotFoundError('profesional')
        }

        await professional.healthInsurances.init();

        let healthInsurances = professional.healthInsurances.getItems();
        if(!includeInactive) {
            healthInsurances = healthInsurances.filter(insurance => insurance.isActive);
        }

        return healthInsurances;
    }

    static async deleteHealthInsurance(idHealthInsurance: number) {
        const em = await getORM().em.fork();
        const healthInsurance = await em.findOne(HealthInsurance, { id : idHealthInsurance });

        if (!healthInsurance) {
            throw new NotFoundError('Obra Social');
        }

        healthInsurance.isActive = false;

        await em.flush();

        return healthInsurance;
    }
}
