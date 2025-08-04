"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const db_1 = require("../orm/db");
const Appointment_1 = require("../model/entities/Appointment");
class AppointmentController {
    static home(req, res) {
        res.send('Soy el controlador de ocupaciones!');
    }
    static async addAppointment(req, res) {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
            const appointment = new Appointment_1.Appointment(description);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(appointment);
            res.status(201).json({ message: 'Appointment added', appointment });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add appointment' });
        }
    }
    static async updateAppointment(req, res) {
        const { id } = req.body;
        const { description } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        if (!description) {
            return res.status(400).json({ message: 'Appointment new name is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const appointment = await em.findOne(Appointment_1.Appointment, { id: id });
        if (!appointment) {
            return res.status(400).json({ message: 'Appointment not found' });
            // throw new Error("Ocupacion no encontrada");
        }
        appointment.description = description;
        await em.persistAndFlush(Appointment_1.Appointment);
        res.status(201).json({ message: 'Appointment updated', appointment });
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