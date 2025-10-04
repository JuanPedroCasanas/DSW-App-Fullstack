"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const db_1 = require("../orm/db");
const Appointment_1 = require("../model/entities/Appointment");
const Patient_1 = require("../model/entities/Patient");
const Professional_1 = require("../model/entities/Professional");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
class AppointmentController {
    static home(req, res) {
        res.send('Soy el controlador de turnos!');
    }
    static async addAppointment(req, res) {
        const { startTime, idProfessional, idPatient, idHealthInsurance, idLegalGuardian } = req.body;
        if (!startTime) {
            return res.status(400).json({ message: 'Se requiere una fecha-hora de inicio valida' }); //Esto es el horario estimo, corregir
        }
        if (!idProfessional) {
            return res.status(400).json({ message: 'Se requiere Id del profesional asignado' });
        }
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere Id del paciente solicitante' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            let patient = await em.findOne(Patient_1.Patient, { idPatient: idPatient });
            if (!patient) {
                return res.status(404).json({ message: 'El ID de paciente ingresado no es valido' });
            }
            let professional = await em.findOne(Professional_1.Professional, { id: idProfessional });
            if (!professional) {
                return res.status(404).json({ message: 'El ID de profesional ingresado no es valido' });
            }
            //EVALUAR SI ESTO HAY QUE PASARLO POR ID O SACARLO DEL PACIENTE/PROFESIONAL, ej: patient.currentHealthInsurance()
            let healthInsurance;
            if (idHealthInsurance) {
                healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: idHealthInsurance }) ?? undefined;
                ;
                if (!healthInsurance) {
                    return res.status(404).json({ message: 'El ID de obra social ingresado no es valido' });
                }
            }
            let legalGuardian;
            legalGuardian = patient.legalGuardian;
            let endTime = new Date(startTime.getTime() + 60 * 60 * 1000); //EndTime es siempre startTime + 1 hora
            const appointment = new Appointment_1.Appointment(startTime, endTime, professional, patient, AppointmentStatus_1.AppointmentStatus.Scheduled, healthInsurance, legalGuardian);
            await em.persistAndFlush(appointment);
            res.status(201).json({ message: 'El turno:\n' + appointment + '\nSe añadió correctamente!' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir el turno.' });
        }
    }
    static async updateAppointmentStartTime(req, res) {
        const { id } = req.body;
        const { startTime } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        if (!startTime) {
            return res.status(400).json({ message: 'Se requiere la nueva fecha a reprogramar del turno' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
        if (!appointment) {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }
        appointment.startTime = startTime;
        appointment.endTime = new Date(startTime.getTime() + 60 * 60 * 1000); //EndTime es siempre startTime + 1 hora
        await em.persistAndFlush(Appointment_1.Appointment);
        res.status(201).json({ message: 'La fecha-hora del turno se actualizó correctamente', appointment });
    }
    //Solo los profesionales y pacientes pueden cancelar turnos
    static async cancelAppointment(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
        if (!appointment) {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }
        appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
        await em.persistAndFlush(Appointment_1.Appointment);
        res.status(201).json({ message: 'El turno se canceló correctamente', appointment });
    }
    //Solo los profesionales pueden completar turnos
    static async completeAppointment(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
        if (!appointment) {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }
        appointment.status = AppointmentStatus_1.AppointmentStatus.Completed;
        await em.persistAndFlush(Appointment_1.Appointment);
        res.status(201).json({ message: 'El turno se completó correctamente', appointment });
    }
    //Solo los profesionales pueden marcar turnos como sin asistencia
    static async missAppointment(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
        if (!appointment) {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }
        appointment.status = AppointmentStatus_1.AppointmentStatus.Missed;
        await em.persistAndFlush(Appointment_1.Appointment);
        res.status(201).json({ message: 'El turno se marcó como \'Sin asistencia\' correctamente', appointment });
    }
    static async getAppointment(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json(appointment);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointment' });
        }
    }
    static async getAppointments(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointments = await em.find(Appointment_1.Appointment, {});
            res.json(appointments);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }
    }
    static async deleteAppointment(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const appointment = await em.findOne(Appointment_1.Appointment, id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            await em.removeAndFlush(appointment);
            res.json(appointment);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete appointment' });
        }
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=AppointmentController.js.map