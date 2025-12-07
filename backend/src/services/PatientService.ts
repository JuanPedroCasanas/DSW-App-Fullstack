import { getORM } from '../orm/db';
import { Patient } from '../model/entities/Patient';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { createUserData } from '../utils/helpers/createUserData';
import { NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';

export class PatientService {

    static async addIndependentPatient(
        firstName: string,
        lastName: string,
        birthdate: Date,
        password: string,
        telephone: string,
        mail: string,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance }) ?? undefined;
        if (!healthInsurance) {
            throw new NotFoundError("Obra social");
        }

        const patient = new Patient(firstName, lastName, birthdate, healthInsurance, telephone);
        const patUser = await createUserData(mail, password);

        patient.user = patUser;
        patUser.patient = patient;

        await em.persistAndFlush(patUser);

        return patient;
    }

    static async addDependentPatient(
        firstName: string,
        lastName: string,
        birthdate: Date,
        idLegalGuardian: number
    ) {
        const em = await getORM().em.fork();

        const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });
        if (!legalGuardian) {
            throw new NotFoundError("Responsable legal");
        }

        const patient = new Patient(
            firstName,
            lastName,
            birthdate,
            legalGuardian.healthInsurance,
            undefined,
            legalGuardian
        );

        await em.persistAndFlush(patient);

        return patient;
    }

    static async updateIndependentPatient(
        idPatient: number,
        firstName: string,
        lastName: string,
        birthdate: Date,
        telephone: string,
        idHealthInsurance: number
    ) {
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, { id: idPatient });

        if (!patient || !patient.isActive) {
            throw new NotFoundError("Paciente");
        }

        const healthInsurance = await em.findOne(HealthInsurance, { id: idHealthInsurance });
        if (!healthInsurance || !healthInsurance.isActive) {
            throw new NotFoundError("Obra social");
        }

        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.birthdate = birthdate;
        patient.telephone = telephone;
        patient.healthInsurance = healthInsurance;

        await em.flush();

        return patient;
    }

    static async updateDependentPatient(
        idPatient: number,
        firstName: string,
        lastName: string,
        birthdate: Date
    ) {
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, { id: idPatient });

        if (!patient || !patient.isActive) {
            throw new NotFoundError("Paciente");
        }

        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.birthdate = birthdate;

        await em.flush();

        return patient;
    }

    static async getPatient(idPatient: number) {
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, { id: idPatient });

        if (!patient || !patient.isActive) {
            throw new NotFoundError("Paciente");
        }

        return patient;
    }

    static async getPatients(includeInactive: boolean) {
        const em = await getORM().em.fork();
        const whereCondition = includeInactive ? {} : { isActive: true };

        return em.find(Patient, whereCondition);
    }

    static async getByLegalGuardian(idLegalGuardian: number, includeInactive: boolean) {
        const em = await getORM().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });

        if (!legalGuardian || !legalGuardian.isActive) {
            throw new NotFoundError('Responsable Legal');
        }

        const whereCondition = includeInactive
            ? { legalGuardian }
            : { legalGuardian, isActive: true };

        return em.find(Patient, whereCondition);
    }

    static async deletePatient(idPatient: number) {
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, { id: idPatient });

        if (!patient || !patient.isActive) {
            throw new NotFoundError("Paciente");
        }

        patient.isActive = false;

        if (patient.user) {
            patient.user.isActive = false;
        }

        await patient.appointments.init();
        for (const appointment of patient.appointments) {
            appointment.status = AppointmentStatus.Canceled;
        }

        await em.flush();

        return patient;
    }
}
