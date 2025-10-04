"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthInsuranceController = void 0;
const db_1 = require("../orm/db");
const HealthInsurance_1 = require("../model/entities/HealthInsurance");
class HealthInsuranceController {
    static home(req, res) {
        res.send('Soy el controlador de pacientes!');
    }
    static async addHealthInsurance(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = new HealthInsurance_1.HealthInsurance(name);
            await em.persistAndFlush(healthinsurance);
            res.status(201).json({ message: 'Health insurance added', healthinsurance });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add Health insurance' });
        }
    }
    static async updateHealthInsurance(req, res) {
        const { id, name } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Name are required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const healthinsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
        if (!healthinsurance) {
            return res.status(404).json({ message: 'Health insurance not found' });
        }
        res.status(200).json({ message: 'Health insurance updated', healthinsurance });
    }
    static async getHealthInsurance(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
            if (!healthinsurance) {
                return res.status(404).json({ message: 'Health insurance not found' });
            }
            res.json(healthinsurance);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch health insurance' });
        }
    }
    static async deleteHealthInsurance(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance_1.HealthInsurance, { idHealthInsurance: id });
            if (!healthinsurance) {
                return res.status(404).json({ message: 'Health insurance not found' });
            }
            await em.removeAndFlush(healthinsurance);
            res.json(healthinsurance);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Health insurance' });
        }
    }
}
exports.HealthInsuranceController = HealthInsuranceController;
//# sourceMappingURL=HealthInsuranceController.js.map