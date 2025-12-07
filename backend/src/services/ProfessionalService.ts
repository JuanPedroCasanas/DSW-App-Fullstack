import { getORM } from '../orm/db';
import { Professional } from '../model/entities/Professional';
import { Occupation } from '../model/entities/Occupation';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { createUserData } from '../utils/helpers/createUserData';
import { User } from '../model/entities/User';
import { EntityAlreadyExistsError, NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { ModuleStatus } from '../model/enums/ModuleStatus';

export class ProfessionalService {

    static async addProfessional(
        firstName: string,
        lastName: string,
        telephone: string,
        mail: string,
        password: string,
        idOccupation: number
    ) {
        const em = await getORM().em.fork();

        const occupation = await em.findOne(Occupation, { id: idOccupation });
        if (!occupation) {
            throw new NotFoundError('Especialidad');
        }

        const professional = new Professional(firstName, lastName, telephone, occupation);
        const profUser: User = await createUserData(mail, password);

        professional.user = profUser;
        profUser.professional = professional;

        await em.persistAndFlush(profUser);

        return professional;
    }

    static async updateProfessional(
        idProfessional: number,
        firstName: string,
        lastName: string,
        telephone: string
    ) {
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, { id: idProfessional });

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        professional.firstName = firstName;
        professional.lastName = lastName;
        professional.telephone = telephone;

        await em.flush();

        return professional;
    }

    static async allowHealthInsurance(
        idProfessional: number,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();

        const professional = await em.findOne(
            Professional,
            { id: idProfessional },
            { populate: ['healthInsurances'] }
        );

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });
        if (!healthInsurance) {
            throw new NotFoundError('Obra Social');
        }

        if (professional.healthInsurances.contains(healthInsurance)) {
            throw new EntityAlreadyExistsError('Obra social');
        }

        professional.healthInsurances.add(healthInsurance);
        await em.flush();

        return professional;
    }

    static async forbidHealthInsurance(
        idProfessional: number,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();

        const professional = await em.findOne(
            Professional,
            { id: idProfessional },
            { populate: ['healthInsurances'] }
        );

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });
        if (!healthInsurance) {
            throw new NotFoundError('Obra Social');
        }

        if (!professional.healthInsurances.contains(healthInsurance)) {
            throw new NotFoundError('Obra Social');
        }

        professional.healthInsurances.remove(healthInsurance);
        await em.flush();

        return professional;
    }

    static async getProfessional(idProfessional: number) {
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, { id: idProfessional });

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        return professional;
    }

    static async getProfessionals(includeInactive: boolean) {
        const em = await getORM().em.fork();
        const whereCondition = includeInactive ? {} : { isActive: true };

        return em.find(Professional, whereCondition, {
            populate: ['occupation'],
        });
    }

    static async getProfessionalsIncludeHealthInsurances(includeInactive: boolean) {
        const em = await getORM().em.fork();
        const whereCondition = includeInactive ? {} : { isActive: true };

        return em.find(Professional, whereCondition, {
            populate: ['occupation', 'healthInsurances'],
        });
    }

    static async getProfessionalsByOccupation(
        idOccupation: number,
        includeInactive: boolean
    ) {
        const em = await getORM().em.fork();

        const occupation = await em.findOne(Occupation, { id: idOccupation });
        if (!occupation) {
            throw new NotFoundError('Especialidad');
        }

        const whereCondition = includeInactive
            ? { occupation }
            : { occupation, isActive: true };

        return em.find(Professional, whereCondition, {
            populate: ['occupation'],
        });
    }

    static async deleteProfessional(idProfessional: number) {
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, { id: idProfessional });

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        professional.isActive = false;
        professional.user.isActive = false;

        await professional.appointments.init();
        await professional.modules.init();

        for (const appointment of professional.appointments) {
            appointment.status = AppointmentStatus.Canceled;
        }

        for (const module of professional.modules) {
            module.status = ModuleStatus.Canceled;
        }

        await em.flush();

        return professional;
    }
}
