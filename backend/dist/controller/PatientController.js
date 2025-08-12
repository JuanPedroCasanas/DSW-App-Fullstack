"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const db_1 = require("../orm/db");
const Patient_1 = require("../model/entities/Patient");
class PatientController {
    static home(req, res) {
        res.send('Soy el controlador de pacientes!');
    }
    static async addPatient(req, res) {
        const { name, lastName, birthdate, telephone, mail, type } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
            const patient = new Patient_1.Patient(name);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(patient);
            res.status(201).json({ message: 'Patient added', patient });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add Patient' });
        }
    }
    static async updatePatient(req, res) {
        const { id } = req.body;
        const { name } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Patient new name is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const Patient = await em.findOne(Patient, { id: id });
        if (!Patient) {
            return res.status(400).json({ message: 'Patient not found' });
            // throw new Error("Ocupacion no encontrada");
        }
        Patient.name = name;
        await em.persistAndFlush(Patient);
        res.status(201).json({ message: 'Patient updated', Patient });
    }
    static async getPatient(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const Patient = await em.findOne(Patient, { id: id });
            if (!Patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(Patient);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patient' });
        }
    }
    static async getPatients(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const Patients = await em.find(Patient_1.Patient, {});
            res.json(Patients);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patients' });
        }
    }
    static async deletePatient(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const Patient = await em.findOne(Patient, { id: id });
            if (!Patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            await em.removeAndFlush(Patient);
            res.json(Patient);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Patient' });
        }
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map