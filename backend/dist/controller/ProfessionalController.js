"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalController = void 0;
const db_1 = require("../orm/db");
const Professional_1 = require("../model/entities/Professional");
const Occupation_1 = require("../model/entities/Occupation");
const UserCreationService_1 = require("../services/UserCreationService");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
const ModuleStatus_1 = require("../model/enums/ModuleStatus");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
class ProfessionalController {
    static home(req, res) {
        res.send('Soy el controlador de profesional!');
    }
    static async addProfessional(req, res) {
        const { firstName, lastName, telephone, mail, password, occupationId } = req.body;
        if (!firstName) {
            return res.status(400).json({ message: 'Se requiere el nombre del profesional' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere el apellido del profesional' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere el telefono del profesional' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere el email del profesional' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Se requiere una contraseña valida' });
        }
        if (!occupationId) {
            return res.status(400).json({ message: 'Se requiere la Id de la especialidad del profesional' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            let occupation = await em.findOne(Occupation_1.Occupation, { id: occupationId });
            if (!occupation) {
                throw new BaseHttpError_1.NotFoundError('Especialidad');
            }
            //Atencion a todo este segmento de código porque asi se  crean los usuarios, se persiste
            //solamente el usuario y eso persiste el profesional, ver anotacion de Cascade dentro de la clase usuario
            const professional = new Professional_1.Professional(firstName, lastName, telephone, occupation);
            const profUser = await (0, UserCreationService_1.createUser)(mail, password);
            professional.user = profUser;
            profUser.professional = professional;
            await em.persistAndFlush(profUser);
            res.status(201).json({ message: 'Se agrego correctamente el profesional ', professional });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al crear el profesional' });
            }
        }
    }
    static async updateProfessional(req, res) {
        const { id, firstName, lastName, telephone } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id de profesional' });
        }
        if (!firstName) {
            return res.status(400).json({ message: 'Se requiere el nombre del profesional' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere el apellido del profesional' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere el telefono del profesional' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professional = await em.findOne(Professional_1.Professional, { id: id });
            if (!professional) {
                throw new BaseHttpError_1.NotFoundError('Profesional');
            }
            professional.firstName = firstName;
            professional.lastName = lastName;
            professional.telephone = telephone;
            await em.flush();
            res.status(201).json({ message: 'Professional updated', professional });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al actualizar el profesional' });
            }
        }
    }
    static async allowHealthInsurance(req, res) {
        const { id, healthInsuranceId } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la Id del profesional' });
        }
        if (!healthInsuranceId) {
            return res.status(400).json({ message: 'Se requiere la Id de la obra social a permitir' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professional = await em.findOne(Professional_1.Professional, { id: id });
            if (!professional) {
                throw new BaseHttpError_1.NotFoundError('Profesional');
            }
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: healthInsuranceId });
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            professional.healthInsurances.add(healthInsurance);
            em.flush();
            res.status(201).json({ message: 'Se agrego correctamente la obra social al profesional ', healthInsurance });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al agregar obra social al profesional' });
            }
        }
    }
    static async forbidHealthInsurance(req, res) {
        const { id, healthInsuranceId } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la Id del profesional' });
        }
        if (!healthInsuranceId) {
            return res.status(400).json({ message: 'Se requiere la Id de la obra social a eliminar' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professional = await em.findOne(Professional_1.Professional, { id: id });
            if (!professional) {
                throw new BaseHttpError_1.NotFoundError('Profesional');
            }
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { id: healthInsuranceId });
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            if (!professional.healthInsurances.contains(healthInsurance)) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            professional.healthInsurances.remove(healthInsurance);
            em.flush();
            res.status(201).json({ message: 'Se elimino correctamente la obra social al profesional ', healthInsurance });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al eliminar obra social del profesional' });
            }
        }
    }
    static async getProfessional(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del profesional' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professional = await em.findOne(Professional_1.Professional, { id: id });
            if (!professional) {
                throw new BaseHttpError_1.NotFoundError('Profesional');
            }
            res.json(professional);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el profesional' });
            }
        }
    }
    static async getProfessionals(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professionals = await em.findAll(Professional_1.Professional);
            res.json(professionals);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }
    static async deleteProfessional(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del profesional' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const professional = await em.findOne(Professional_1.Professional, { id: id });
            if (!professional) {
                throw new BaseHttpError_1.NotFoundError('Profesional');
            }
            professional.isActive = false;
            professional.user.isActive = false;
            await professional.appointments.init();
            await professional.modules.init();
            for (const appointment of professional.appointments) {
                appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
            }
            for (const module of professional.modules) {
                module.status = ModuleStatus_1.ModuleStatus.Canceled;
            }
            await em.flush();
            res.status(201).json({ message: 'Se elimino correctamente el profesional ', professional });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al eliminar el profesional' });
            }
        }
    }
}
exports.ProfessionalController = ProfessionalController;
//# sourceMappingURL=ProfessionalController.js.map