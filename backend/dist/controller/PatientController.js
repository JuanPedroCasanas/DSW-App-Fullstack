"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const db_1 = require("../orm/db");
const Patient_1 = require("../model/entities/Patient");
const LegalGuardian_1 = require("../model/entities/LegalGuardian");
const UserCreationService_1 = require("../services/UserCreationService");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
const safeSerialize_1 = require("../utils/safeSerialize");
class PatientController {
    static home(req, res) {
        return res.send('Soy el controlador de pacientes!');
    }
    //Para pacientes que no dependen de un responsable legal, se les crea usuario para acceder
    static async addIndependentPatient(req, res) {
        const { firstName, lastName, birthdate, password, telephone, mail, idHealthInsurance } = req.body;
        if (!firstName) {
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
        if (!idHealthInsurance) {
            return res.status(400).json({ message: 'Se requiere una Id de obra social valida' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: idHealthInsurance }) ?? undefined;
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError("Obra social");
            }
            const patient = new Patient_1.Patient(firstName, lastName, birthdate, healthInsurance, telephone);
            const patUser = await (0, UserCreationService_1.createUser)(mail, password);
            patient.user = patUser;
            patUser.patient = patient;
            await em.persistAndFlush(patUser);
            return res.status(201).json({ message: 'Se agrego correctamente el paciente', patient: (0, safeSerialize_1.safeSerialize)(patient) });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al agregar el paciente' });
            }
        }
    }
    //Para pacientes que dependen de un responsable legal, sin usuario ni info de contacto
    static async addDependentPatient(req, res) {
        const { firstName, lastName, birthdate, idLegalGuardian } = req.body;
        if (!firstName) {
            return res.status(400).json({ message: 'Se requiere nombre' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
        }
        if (!idLegalGuardian) {
            return res.status(400).json({ message: 'Se requiere una ID de responsable legal valida' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            let legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian) {
                throw new BaseHttpError_1.NotFoundError("Responsable legal");
            }
            const patient = new Patient_1.Patient(firstName, lastName, birthdate, legalGuardian.healthInsurance, undefined, legalGuardian);
            //Si no se aclara contraseña, entonces este metodo fue llamado para añadir a un paciente dependiente de un resp legal, que no requiere usuario
            await em.persistAndFlush(patient);
            return res.status(201).json({ message: 'Se añadió correctamente al paciente', patient: (0, safeSerialize_1.safeSerialize)(patient) });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al agregar al paciente' });
            }
        }
    }
    static async updateIndependentPatient(req, res) {
        const { idPatient } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        const { telephone } = req.body;
        const { idHealthInsurance } = req.body;
        try {
            if (!idPatient) {
                return res.status(400).json({ message: 'Se requiere la ID del paciente a modificar' });
            }
            if (!firstName) {
                return res.status(400).json({ message: 'Se requiere el nuevo nombre del paciente' });
            }
            if (!lastName) {
                return res.status(400).json({ message: 'Se requiere el nuevo apellido del paciente' });
            }
            if (!birthdate) {
                return res.status(400).json({ message: 'Se requiere la nueva fecha de nacimiento del paciente' });
            }
            if (!telephone) {
                return res.status(400).json({ message: 'Se requiere el nuevo telefono del paciente' });
            }
            if (!idHealthInsurance) {
                return res.status(400).json({ message: 'Se requiere la nueva OS del paciente' });
            }
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: idPatient });
            if (!patient || !patient?.isActive) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: idHealthInsurance });
            if (!healthInsurance || !healthInsurance?.isActive) {
                throw new BaseHttpError_1.NotFoundError("Obra social");
            }
            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.birthdate = birthdate;
            patient.telephone = telephone;
            patient.healthInsurance = healthInsurance;
            await em.flush();
            return res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient: (0, safeSerialize_1.safeSerialize)(patient) });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al modificar el paciente' });
            }
        }
    }
    static async updateDependentPatient(req, res) {
        const { idPatient } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        try {
            if (!idPatient) {
                return res.status(400).json({ message: 'Se requiere la ID del paciente a modificar' });
            }
            if (!firstName) {
                return res.status(400).json({ message: 'Se requiere el nuevo nombre del paciente' });
            }
            if (!lastName) {
                return res.status(400).json({ message: 'Se requiere el nuevo apellido del paciente' });
            }
            if (!birthdate) {
                return res.status(400).json({ message: 'Se requiere la nueva fecha de nacimiento del paciente' });
            }
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: Number(idPatient) });
            if (!patient || !patient?.isActive) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.birthdate = birthdate;
            await em.flush();
            return res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient: (0, safeSerialize_1.safeSerialize)(patient) });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al modificar el paciente' });
            }
        }
    }
    static async getPatient(req, res) {
        const idPatient = Number(req.params.id);
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere la ID del paciente' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: idPatient });
            if (!patient || !patient?.isActive) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            return res.status(200).json((0, safeSerialize_1.safeSerialize)(patient));
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }
    static async getPatients(req, res) {
        let includeInactive;
        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        }
        else {
            includeInactive = req.query.includeInactive === 'true';
            // true si el string es 'true', false si es cualquier otra cosa
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const whereCondition = (includeInactive) ? {} : { isActive: true };
            const patients = await em.find(Patient_1.Patient, whereCondition);
            return res.status(200).json((0, safeSerialize_1.safeSerialize)(patients));
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes' });
        }
    }
    static async getByLegalGuardian(req, res) {
        const idLegalGuardian = Number(req.params.id);
        let includeInactive;
        if (!req.query || req.query.includeInactive === undefined) {
            includeInactive = true;
        }
        else {
            includeInactive = req.query.includeInactive === 'true';
            // true si el string es 'true', false si es cualquier otra cosa
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian || !legalGuardian.isActive) {
                throw new BaseHttpError_1.NotFoundError('Responsable Legal');
            }
            const whereCondition = (includeInactive) ? { legalGuardian: legalGuardian } : { legalGuardian: legalGuardian, isActive: true };
            const patients = await em.find(Patient_1.Patient, whereCondition);
            return res.status(200).json((0, safeSerialize_1.safeSerialize)(patients));
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes por responsable legal' });
        }
    }
    static async deletePatient(req, res) {
        const idPatient = Number(req.params.id);
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere la id del paciente' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: idPatient });
            if (!patient || !patient?.isActive) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            patient.isActive = false;
            if (patient.user) {
                patient.user.isActive = false;
            }
            await patient.appointments.init();
            for (const appointment of patient.appointments) {
                appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
            }
            await em.flush();
            return res.status(200).json({ message: 'Paciente dado de baja correctamente: ', patient: (0, safeSerialize_1.safeSerialize)(patient) });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map