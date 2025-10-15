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
class PatientController {
    static home(req, res) {
        res.send('Soy el controlador de pacientes!');
    }
    //Para pacientes que no dependen de un responsable legal, se les crea usuario para acceder
    static async addIndependentPatient(req, res) {
        const { firstName, lastName, birthdate, password, telephone, mail, healthInsuranceId } = req.body;
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
        if (!healthInsuranceId) {
            return res.status(400).json({ message: 'Se requiere una Id de obra social valida' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: healthInsuranceId }) ?? undefined;
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError("Obra social");
            }
            const patient = new Patient_1.Patient(firstName, lastName, birthdate, telephone, healthInsuranceId);
            const patUser = await (0, UserCreationService_1.createUser)(mail, password);
            patient.user = patUser;
            patUser.patient = patient;
            await em.persistAndFlush(patUser);
            res.status(201).json({ message: 'Se agrego correctamente el paciente', patient });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al agregar el paciente' });
            }
        }
    }
    //Para pacientes que dependen de un responsable legal, sin usuario ni info de contacto
    static async addDependentPatient(req, res) {
        const { firstName, lastName, birthdate, legalGuardianId } = req.body;
        if (!firstName) {
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
            let legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: legalGuardianId });
            if (!legalGuardian) {
                throw new BaseHttpError_1.NotFoundError("Responsable legal");
            }
            const patient = new Patient_1.Patient(firstName, lastName, birthdate, legalGuardian.healthInsurance, undefined, legalGuardian);
            //Si no se aclara contraseña, entonces este metodo fue llamado para añadir a un paciente dependiente de un resp legal, que no requiere usuario
            await em.persistAndFlush(patient);
            res.status(201).json({ message: 'Se añadió correctamente al paciente', patient });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al agregar al paciente' });
            }
        }
    }
    static async updatePatient(req, res) {
        const { id } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        const { telephone } = req.body;
        const { type } = req.body;
        try {
            if (!id) {
                return res.status(400).json({ message: 'Patient id is required' });
            }
            if (!firstName) {
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
            if (!type) {
                return res.status(400).json({ message: 'Patient new type is required' });
            }
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: id });
            if (!patient) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.birthdate = birthdate;
            patient.telephone = telephone;
            await em.flush();
            res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al modificar el paciente' });
            }
        }
    }
    static async getPatient(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la ID del paciente' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: id });
            if (!patient) {
                throw new BaseHttpError_1.NotFoundError("Paciente");
            }
            res.json(patient);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }
    static async getPatients(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patients = await em.find(Patient_1.Patient, {});
            res.json(patients);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al buscar los pacientes' });
        }
    }
    static async deletePatient(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del paciente' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const patient = await em.findOne(Patient_1.Patient, { id: id });
            if (!patient) {
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
            res.json(patient);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map