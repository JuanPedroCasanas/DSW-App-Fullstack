"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const db_1 = require("../orm/db");
const Patient_1 = require("../model/entities/Patient");
const LegalGuardian_1 = require("../model/entities/LegalGuardian");
const UserCreationService_1 = require("../services/UserCreationService");
class PatientController {
    static home(req, res) {
        res.send('Soy el controlador de pacientes!');
    }
    //Para pacientes que no dependen de un responsable legal, se les crea usuario para acceder
    static async addIndependentPatient(req, res) {
        const { name, lastName, birthdate, password, telephone, mail } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Se requiere nombre' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere un telefono valido' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere un email valido' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Se requiere una contraseña valida' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = new Patient_1.Patient(name, lastName, birthdate, telephone, mail);
            //Si se aclara contraseña, se trata de un paciente independiente que requiere usuario
            const patUser = await (0, UserCreationService_1.createUser)(mail, password);
            patient.user = patUser;
            patUser.patient = patient;
            await em.persistAndFlush(patUser);
            res.status(201).json({ message: 'Se agrego correctamente el paciente', patient });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar el paciente' });
        }
    }
    //Para pacientes que dependen de un responsable legal, sin usuario ni info de contacto
    static async addDependentPatient(req, res) {
        const { name, lastName, birthdate, password, legalGuardianId } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Se requiere nombre' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
        }
        if (!legalGuardianId) {
            return res.status(400).json({ message: 'Se requiere una ID de responsable legal valida' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            let legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { idLegalGuardian: legalGuardianId });
            if (!legalGuardian) {
                return res.status(404).json({ message: 'ID del responsable legal invalida.' });
            }
            const patient = new Patient_1.Patient(name, lastName, birthdate, undefined, undefined, legalGuardian);
            //Si no se aclara contraseña, entonces este metodo fue llamado para añadir a un paciente dependiente de un resp legal, que no requiere usuario
            await em.persistAndFlush(patient);
            res.status(201).json({ message: 'Se añadió correctamente al paciente', patient });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar al paciente' });
        }
    }
    static async updatePatient(req, res) {
        const { id } = req.body;
        const { name } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        const { telephone } = req.body;
        const { mail } = req.body;
        const { type } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Patient new name is required' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Patient new last name is required' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Patient new birthdate is required' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Patient new telephone is required' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Patient new mail is required' });
        }
        if (!type) {
            return res.status(400).json({ message: 'Patient new type is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const patient = await em.findOne(Patient_1.Patient, { idPatient: id });
        if (!patient) {
            return res.status(400).json({ message: 'Patient not found' });
        }
        patient.firstName = name;
        patient.lastName = lastName;
        patient.birthdate = birthdate;
        patient.telephone = telephone;
        patient.mail = mail;
        await em.persistAndFlush(patient);
        res.status(201).json({ message: 'Patient updated', patient });
    }
    static async getPatient(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { idPatient: id });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(patient);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patient' });
        }
    }
    static async getPatients(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patients = await em.find(Patient_1.Patient, {});
            res.json(patients);
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
            const patient = await em.findOne(Patient_1.Patient, { idPatient: id });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            await em.removeAndFlush(patient);
            res.json(patient);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Patient' });
        }
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map