"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationController = void 0;
const db_1 = require("../orm/db");
const Occupation_1 = require("../model/entities/Occupation");
class OccupationController {
    static home(req, res) {
        res.send('Soy el controlador de ocupaciones!');
    }
    static async addOccupation(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
            const occupation = new Occupation_1.Occupation(name);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(occupation);
            res.status(201).json({ message: 'Occupation added', occupation });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add occupation' });
        }
    }
    static async updateOccupation(req, res) {
        const { id } = req.body;
        const { name } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Occupation new name is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const occupation = await em.findOne(Occupation_1.Occupation, { id: id });
        if (!occupation) {
            return res.status(400).json({ message: 'Occupation not found' });
        }
        occupation.name = name;
        await em.persistAndFlush(occupation);
        res.status(201).json({ message: 'Occupation updated', occupation });
    }
    static async getOccupation(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupation = await em.findOne(Occupation_1.Occupation, { id: id });
            if (!occupation) {
                return res.status(404).json({ message: 'Occupation not found' });
            }
            res.json(occupation);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch occupation' });
        }
    }
    static async getOccupations(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupations = await em.find(Occupation_1.Occupation, {});
            res.json(occupations);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch occupations' });
        }
    }
    static async deleteOccupation(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const occupation = await em.findOne(Occupation_1.Occupation, id);
            if (!occupation) {
                return res.status(404).json({ message: 'Occupation not found' });
            }
            await em.removeAndFlush(occupation);
            res.json(occupation);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete occupation' });
        }
    }
}
exports.OccupationController = OccupationController;
//# sourceMappingURL=OccupationController.js.map