"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthInsuranceController = void 0;
const db_1 = require("../orm/db");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
class HealthInsuranceController {
    static home(req, res) {
        res.send('Soy el controlador de Obras Sociales!');
    }
    static async addHealthInsurance(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Se requiere un nombre de obra social' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = new HealthInsurance_1.HealthInsurance(name);
            await em.persistAndFlush(healthinsurance);
            res.status(201).json({ message: 'Obra social añadida: ', healthinsurance });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir obra social' });
        }
    }
    static async updateHealthInsurance(req, res) {
        const { id, name } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Se requiere un nombre de obra social' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
            if (!healthinsurance) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            res.status(200).json({ message: 'Obra social actualizada: ', healthinsurance });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al actualizar Obra Social' });
            }
        }
    }
    static async getHealthInsurance(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
            if (!healthinsurance) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            res.json(healthinsurance);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar Obra Social' });
            }
        }
    }
    static async getHealthInsurances(reque, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurances = await em.findAll(HealthInsurance_1.HealthInsurance);
            res.json(healthinsurances);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar Obras Sociales' });
        }
    }
    static async deleteHealthInsurance(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthInsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
            if (!healthInsurance) {
                throw new BaseHttpError_1.NotFoundError('Obra Social');
            }
            healthInsurance.isActive = false; //No cascadeamos los resultados porque sería demasiado, en el negocio se arreglaria entre paciente y prof
            res.json(healthInsurance);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al eliminar Obra Social' });
            }
        }
    }
}
exports.HealthInsuranceController = HealthInsuranceController;
//# sourceMappingURL=HealthInsuranceController.js.map