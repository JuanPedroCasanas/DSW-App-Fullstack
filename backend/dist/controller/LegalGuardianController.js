"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalGuardianController = void 0;
const db_1 = require("../orm/db");
const LegalGuardian_1 = require("../model/entities/LegalGuardian");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
const UserCreationService_1 = require("../services/UserCreationService");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
class LegalGuardianController {
    static home(req, res) {
        return res.send('Soy el controlador de Responsable Legal!');
    }
    static async addLegalGuardian(req, res) {
        const { firstName, lastName, birthdate, telephone, mail, password, idHealthInsurance } = req.body;
        if (!firstName) {
            return res.status(400).json({ message: 'Se requiere nombre del responsable legal' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido del responsable legal' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere fecha de nacimiento del responsable legal' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere telefono del responsable legal' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere email del responsable legal' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Se requiere contraseña de la cuenta del responsable legal' });
        }
        if (!idHealthInsurance) {
            return res.status(400).json({ message: 'Se requiere obra social del responsable legal' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            let healthInsurance;
            healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: idHealthInsurance }) ?? undefined;
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError("Obra social");
            }
            const legalGuardian = new LegalGuardian_1.LegalGuardian(firstName, lastName, birthdate, telephone, healthInsurance);
            const lgUser = await (0, UserCreationService_1.createUser)(mail, password);
            legalGuardian.user = lgUser;
            lgUser.legalGuardian = legalGuardian;
            await em.persistAndFlush(lgUser);
            return res.status(201).json({ message: 'Se agrego correctamente el responsable legal ', legalGuardian });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al crear responsable legal' });
            }
        }
    }
    static async updateLegalGuardian(req, res) {
        const { id } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        const { telephone } = req.body;
        const { idHealthInsurance } = req.body;
        if (!firstName) {
            return res.status(400).json({ message: 'Se requiere nombre del responsable legal' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido del responsable legal' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere fecha de nacimiento del responsable legal' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere telefono del responsable legal' });
        }
        if (!idHealthInsurance) {
            return res.status(400).json({ message: 'Se requiere obra social del responsable legal' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: id });
        try {
            if (!legalGuardian || !legalGuardian?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Responsable Legal');
            }
            legalGuardian.firstName = firstName;
            legalGuardian.lastName = lastName;
            legalGuardian.birthdate = birthdate;
            legalGuardian.telephone = telephone;
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: idHealthInsurance });
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError("Obra social");
            }
            legalGuardian.healthInsurance = healthInsurance;
            await em.persistAndFlush(LegalGuardian_1.LegalGuardian);
            return res.status(201).json({ message: 'Responsable Legal actualizado correctamente', LegalGuardian: LegalGuardian_1.LegalGuardian });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al actualizar responsable legal' });
            }
        }
    }
    static async getLegalGuardian(req, res) {
        const idLegalGuardian = Number(req.params.id);
        if (!idLegalGuardian) {
            return res.status(400).json({ message: 'Se requiere ID del responsable legal' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian || !legalGuardian?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Responsable Legal');
            }
            return res.status(200).json(LegalGuardian_1.LegalGuardian);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar responsable legal' });
            }
        }
    }
    static async getLegalGuardianPatients(req, res) {
        const idLegalGuardian = Number(req.params.id);
        if (!idLegalGuardian) {
            return res.status(400).json({ message: 'Se requiere ID del responsable legal' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian || !legalGuardian?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Responsable Legal');
            }
            await legalGuardian.guardedPatients.init(); // Las colecciones entiendo son lazy loaded, espero a que carguen
            const legalGuardianPatients = legalGuardian.guardedPatients;
            return res.status(200).json(legalGuardianPatients);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar pacientes del responsable legal' });
            }
        }
    }
    static async deleteLegalGuardian(req, res) {
        const idLegalGuardian = Number(req.params.id);
        if (!idLegalGuardian) {
            return res.status(400).json({ message: 'Se requiere id del responsable legal' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian_1.LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian || !legalGuardian?.isActive) {
                throw new BaseHttpError_1.NotFoundError('Responsable Legal');
            }
            legalGuardian.isActive = false;
            legalGuardian.user.isActive = false;
            await legalGuardian.guardedPatients.init(); // Las colecciones entiendo son lazy loaded, espero a que carguen
            for (const patient of legalGuardian.guardedPatients) {
                patient.isActive = false;
            }
            await legalGuardian.appointments.init();
            for (const appointment of legalGuardian.appointments) {
                appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
            }
            await em.flush();
            return res.status(201).json({ message: 'Se eliminó correctamente el responsable legal', legalGuardian });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar responsable legal' });
            }
        }
    }
}
exports.LegalGuardianController = LegalGuardianController;
//# sourceMappingURL=LegalGuardianController.js.map