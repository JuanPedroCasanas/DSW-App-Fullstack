"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationController = void 0;
const db_1 = require("../orm/db");
const Occupation_1 = require("../model/entities/Occupation");
const core_1 = require("@mikro-orm/core");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
class OccupationController {
    static home(req, res) {
        return res.send('Soy el controlador de ocupaciones!');
    }
    static async addOccupation(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Se requiere nombre de la especialidad' });
        }
        try {
            const occupation = new Occupation_1.Occupation(name);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(occupation);
            return res.status(201).json({ message: 'Especialidad añadida', occupation });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al añadir la especialidad' });
        }
    }
    static async updateOccupation(req, res) {
        const { idOccupation } = req.body;
        const { name } = req.body;
        if (!idOccupation) {
            return res.status(400).json({ message: 'Se requiere el ID de la especialidad' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Se requiere el nombre de la especialidad' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupation = await em.findOne(Occupation_1.Occupation, { id: idOccupation });
            if (!occupation) {
                throw new core_1.NotFoundError('Especialidad');
            }
            occupation.name = name;
            await em.persistAndFlush(occupation);
            return res.status(201).json({ message: 'Especialidad actualizada', occupation });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al modificar especialidad' });
            }
        }
    }
    static async getOccupation(req, res) {
        const idOccupation = Number(req.params.id);
        if (!idOccupation) {
            return res.status(400).json({ message: 'Se requiere el ID de la especialidad' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupation = await em.findOne(Occupation_1.Occupation, { id: idOccupation });
            if (!occupation) {
                throw new core_1.NotFoundError('Especialidad');
            }
            return res.status(200).json(occupation);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar especialidad' });
            }
        }
    }
    static async getOccupations(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupations = await em.findAll(Occupation_1.Occupation);
            return res.status(200).json(occupations);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar especialidades' });
        }
    }
    static async deleteOccupation(req, res) {
        const idOccupation = Number(req.params.id);
        if (!idOccupation) {
            return res.status(400).json({ message: 'Se requiere ID de la especialidad' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupation = await em.findOne(Occupation_1.Occupation, { id: idOccupation });
            if (!occupation) {
                throw new core_1.NotFoundError('Especialidad');
            }
            await em.removeAndFlush(occupation); //No vemos necesidad de borrado logico aca, tampoco necesidad de cascade, es un caso muy extremo en terminos de negocio
            return res.status(200).json(occupation);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar especialidad' });
            }
        }
    }
}
exports.OccupationController = OccupationController;
//# sourceMappingURL=OccupationController.js.map