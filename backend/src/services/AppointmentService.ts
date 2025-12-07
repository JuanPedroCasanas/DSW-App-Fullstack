import { getORM } from '../orm/db';
import { Appointment } from '../model/entities/Appointment';
import { Patient } from '../model/entities/Patient';
import { Professional } from '../model/entities/Professional';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import {
    AppointmentNotAvailableError,
    BaseHttpError,
    InvalidParameterError,
    InvalidStatusChangeError,
    NotFoundError
} from '../model/errors/BaseHttpError';

export class AppointmentService {

    static async assignAppointment(idAppointment: number, idPatient: number) {
        const em = await getORM().em.fork();

        const appointment = await em.findOne(Appointment, { id: idAppointment });
        if(!appointment) {
            throw new NotFoundError('Turno');
        } 

        if(appointment.status != AppointmentStatus.Available) {
            throw new AppointmentNotAvailableError();
        }

        const patient = await em.findOne(Patient, { id: idPatient })
        if(!patient) {
            throw new NotFoundError('Paciente');
        }

        const legalGuardian = patient.legalGuardian;

        appointment.legalGuardian = legalGuardian;
        appointment.patient = patient;
        appointment.healthInsurance = patient.healthInsurance;
        appointment.status = AppointmentStatus.Scheduled;

        await em.flush();
        return appointment;
    }

    static async updateAppointmentStatus(idAppointment: number, newStatus:string) {
        const em = await getORM().em.fork();

        const ALLOWED_STATUSES = new Set<string>([
            AppointmentStatus.Missed,
            AppointmentStatus.Canceled,
            AppointmentStatus.Completed
        ]);

        if (!ALLOWED_STATUSES.has(newStatus)) {
            throw new InvalidParameterError(newStatus);
        }

        const appointment = await em.findOne(Appointment, { id: idAppointment });

        if(!appointment)
        {
            throw new NotFoundError('Turno');
        }

        if(appointment.status != AppointmentStatus.Scheduled && appointment.status != AppointmentStatus.Available) {
            throw new InvalidStatusChangeError("Turno", appointment.status, newStatus);
        }

        appointment.status = newStatus as AppointmentStatus;
        await em.flush();

        return appointment;
    }


    static async getAppointment(idAppointment: number) {
        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: idAppointment });
        if (!appointment) {
            throw new NotFoundError('Turno');
        }
        return appointment;
    }

    static async getAppointments() {
        const em = await getORM().em.fork();
        const appointments = await em.findAll(Appointment);
        return appointments;
    }

    static async getAvailableAppointments() {
        const em = await getORM().em.fork();
        const appointments = await em.find(Appointment, { status : AppointmentStatus.Available});
        return appointments;
    }

    static async getAppointmentsByPatient(idPatient: number) {
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, { id: idPatient });
        if(!patient) {
            throw new NotFoundError('Paciente');
        }
        const appointments = await em.find(Appointment, { patient :  patient });
        return appointments;
    }

    static async getAvailableAppointmentsByProfessional(idProfessional: number) {
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, {id: idProfessional});

        if (!professional || !professional.isActive) {
            throw new NotFoundError('Profesional');
        }

        const appointments = await em.find(
            Appointment,
            { status : AppointmentStatus.Available, professional : professional}
        );
        return appointments;
    }

    static async getScheduledAppointments() {
        const em = await getORM().em.fork();
        const appointments = await em.find(
            Appointment,
            { status : AppointmentStatus.Scheduled },
            { populate: ['patient', 'professional', 'legalGuardian', 'healthInsurance'] }
        );

        return appointments;
    }

    static async getAppointmentsByStatus(status?: string) {

        const ALLOWED_STATUSES = new Set<string>(Object.values(AppointmentStatus));

        const em = await getORM().em.fork();

        let whereCondition: Record<string, any> = {};
        
        if (status === undefined || status === '') {
            whereCondition = {};
        } 
         else if (ALLOWED_STATUSES.has(status)) {
            whereCondition = { status };
        } 
         else {
            throw new InvalidParameterError(status);
        }

        const appointments = await em.find(
            Appointment,
            whereCondition,
            { populate: ['patient', 'professional', 'legalGuardian', 'healthInsurance'] }
        );

        return appointments;
    }
}
