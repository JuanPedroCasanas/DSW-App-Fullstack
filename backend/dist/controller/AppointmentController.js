"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const db_1 = require("../orm/db");
const Appointment_1 = require("../model/entities/Appointment");
const Patient_1 = require("../model/entities/Patient");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
class AppointmentController {
    static home(req, res) {
        return res.send('Soy el controlador de turnos!');
    }
    static async assignAppointment(req, res) {
        const { idAppointment, idPatient } = req.body;
        if (!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id de turno a asignar' });
        }
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere el id de paciente a asignar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: idAppointment });
            if (!appointment) {
                throw new BaseHttpError_1.NotFoundError('Turno');
            }
            if (appointment.status != AppointmentStatus_1.AppointmentStatus.Available) {
                throw new BaseHttpError_1.AppointmentNotAvailableError();
            }
            const patient = await em.findOne(Patient_1.Patient, { id: idPatient });
            if (!patient) {
                throw new BaseHttpError_1.NotFoundError('Paciente');
            }
            const legalGuardian = patient.legalGuardian;
            appointment.legalGuardian = legalGuardian;
            appointment.patient = patient;
            appointment.healthInsurance = patient.healthInsurance;
            appointment.status = AppointmentStatus_1.AppointmentStatus.Scheduled;
            await em.flush();
            return res.status(200).json({ message: 'Se asigno correctamente el paciente al turno', appointment });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al asignar turno' });
            }
        }
    }
    //Solo los profesionales y pacientes pueden cancelar turnos
    static async cancelAppointment(req, res) {
        const { idAppointment } = req.body;
        if (!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: idAppointment });
            if (!appointment) {
                throw new BaseHttpError_1.NotFoundError('Turno');
            }
            appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
            await em.flush();
            return res.status(201).json({ message: 'El turno se canceló correctamente', appointment });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al cancelar el turno' });
            }
        }
    }
    //Solo los profesionales pueden completar turnos
    static async completeAppointment(req, res) {
        const { idAppointment } = req.body;
        if (!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: idAppointment });
            if (!appointment) {
                throw new BaseHttpError_1.NotFoundError('Turno');
            }
            appointment.status = AppointmentStatus_1.AppointmentStatus.Completed;
            await em.flush();
            return res.status(201).json({ message: 'El turno se completó correctamente', appointment });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error completar turno' });
            }
        }
    }
    //Solo los profesionales pueden marcar turnos como sin asistencia
    static async missAppointment(req, res) {
        const { idAppointment } = req.body;
        if (!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: idAppointment });
            if (!appointment) {
                throw new BaseHttpError_1.NotFoundError('Turno');
            }
            appointment.status = AppointmentStatus_1.AppointmentStatus.Missed;
            await em.flush();
            return res.status(201).json({ message: 'El turno se marcó como  correctamente', appointment });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al marcar turno como \'Sin asistencia\'' });
            }
        }
    }
    static async getAppointment(req, res) {
        const idAppointment = Number(req.params.id);
        if (!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id del turno a buscar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: idAppointment });
            if (!appointment) {
                throw new BaseHttpError_1.NotFoundError('Turno');
            }
            return res.status(200).json(appointment);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el turno' });
            }
        }
    }
    static async getAppointments(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointments = await em.findAll(Appointment_1.Appointment);
            return res.status(200).json(appointments);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }
    static async getAvailableAppointments(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointments = await em.find(Appointment_1.Appointment, { status: AppointmentStatus_1.AppointmentStatus.Available });
            return res.json(appointments);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }
    static async getAppointmentsByPatient(req, res) {
        const idPatient = Number(req.params.id);
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere el id del paciente para los turnos a buscar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: idPatient });
            if (!patient) {
                throw new BaseHttpError_1.NotFoundError('Paciente');
            }
            const appointments = await em.find(Appointment_1.Appointment, { patient: patient });
            return res.status(200).json(appointments);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar turnos por paciente' });
            }
        }
    }
    // REHACER..
    static async getAppointmentsByDateAndProfessional(req, res) {
        /* const idPatient = Number(req.params.id);
         if(!idPatient) {
             return res.status(400).json({ message: 'Se requiere el id del paciente para los turnos a buscar' });
         }
     try {
         const em = await getORM().em.fork();
         const patient = await em.findOne(Patient, { id: idPatient });
         if(!patient) {
             throw new NotFoundError('Paciente');
         }
         const appointments = await em.find(Appointment, { patient :  patient });
         return res.status(200).json(appointments);
 
     } catch (error) {
         console.error(error);
         if (error instanceof BaseHttpError) {
             return res.status(error.status).json(error.toJSON());
         }
         else {
             return res.status(500).json({ message: 'Error al buscar turnos por paciente' });
         }
     } */
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=AppointmentController.js.map