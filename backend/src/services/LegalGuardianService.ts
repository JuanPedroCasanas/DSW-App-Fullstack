import { getORM } from '../orm/db';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { User } from '../model/entities/User';
import { createUserData } from '../utils/helpers/createUserData';
import { BaseHttpError, NotFoundError } from '../utils/errors/BaseHttpError';
import { AppointmentStatus } from '../utils/enums/AppointmentStatus';

export class LegalGuardianService {

    static async addLegalGuardian(
        firstName: string,
        lastName: string,
        birthdate: Date,
        telephone: string,
        mail: string,
        password: string,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();   

        const healthInsurance = await em.findOne(HealthInsurance, { id : idHealthInsurance }) ?? undefined;

        if(!healthInsurance) {
            throw new NotFoundError("Obra social");
        }

        const legalGuardian = new LegalGuardian(firstName, lastName, birthdate, telephone, healthInsurance);
        const lgUser: User = await createUserData(mail, password);
        legalGuardian.user = lgUser;
        lgUser.legalGuardian = legalGuardian;
                
        await em.persistAndFlush(lgUser);

        return legalGuardian;
    }

    static async updateLegalGuardian(
        idLegalGuardian: number,
        firstName: string,
        lastName: string,
        birthdate: Date,
        telephone: string,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });

        if(!legalGuardian || !legalGuardian?.isActive)
        {
            throw new NotFoundError('Responsable Legal');
        }

        legalGuardian.firstName = firstName;
        legalGuardian.lastName = lastName;
        legalGuardian.birthdate = birthdate;
        legalGuardian.telephone = telephone;

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });

        if(!healthInsurance) {
            throw new NotFoundError("Obra social");
        }

        legalGuardian.healthInsurance = healthInsurance;

        await em.flush();

        return legalGuardian;
    }

    static async getLegalGuardians(includeInactive: boolean) {
        const em = await getORM().em.fork();
        const whereCondition = (includeInactive) ? {} : { isActive: true };
        const legalGuardians = await em.find(LegalGuardian, whereCondition);

        return legalGuardians;
    }

    static async getLegalGuardian(idLegalGuardian: number) {
        const em = await getORM().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });

        if (!legalGuardian || !legalGuardian?.isActive) {
            throw new NotFoundError('Responsable Legal');
        }

        return legalGuardian;
    }

    static async deleteLegalGuardian(idLegalGuardian: number) {
        const em = await getORM().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian, { id : idLegalGuardian });

        if (!legalGuardian || !legalGuardian?.isActive) {
            throw new NotFoundError('Responsable Legal');
        }

        legalGuardian.isActive = false;
        legalGuardian.user.isActive = false;

        await legalGuardian.guardedPatients.init();
        for (const patient of legalGuardian.guardedPatients) {
            patient.isActive = false;
        }

        await legalGuardian.appointments.init();
        for (const appointment of legalGuardian.appointments) {
            appointment.status = AppointmentStatus.Canceled;
        }

        await em.flush();

        return legalGuardian;
    }
}
