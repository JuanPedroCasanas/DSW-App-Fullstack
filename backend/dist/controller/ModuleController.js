"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../orm/db");
const Module_1 = require("../model/entities/Module");
const Professional_1 = require("../model/entities/Professional");
const ConsultingRoom_1 = require("../model/entities/ConsultingRoom");
const ModuleType_1 = require("../model/entities/ModuleType");
class ModuleController {
    static home(req, res) {
        res.send('Soy el controlador de modulos!');
    }
    static async addModule(req, res) {
        const { day, startTime, validMonth, professionalId, consultingRoomId, moduleTypeId } = req.body;
        // Validaciones básicas
        if (!day || !startTime || !validMonth || !professionalId || !consultingRoomId || !moduleTypeId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            // Buscar entidades relacionadas
            const professional = await em.findOne(Professional_1.Professional, { id: professionalId });
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: consultingRoomId });
            const moduleType = await em.findOne(ModuleType_1.ModuleType, { idModuleType: moduleTypeId });
            res.status(201).json({ message: 'Module added', module });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add module' });
        }
    }
    static async updateModule(req, res) {
        const { day, startTime, validMonth, professionalId, consultingRoom, moduleType } = req.body;
        if (!day) {
            return res.status(400).json({ message: 'Module day is required' });
        }
        if (!startTime) {
            return res.status(400).json({ message: 'Module start time is required' });
        }
        if (!validMonth) {
            return res.status(400).json({ message: 'Module valid month is required' });
        }
        if (!professionalId) {
            return res.status(400).json({ message: 'Module professional id is required' });
        }
        if (!consultingRoom) {
            return res.status(400).json({ message: 'Module consulting room is required' });
        }
        if (!moduleType) {
            return res.status(400).json({ message: 'Module type is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const idModule = Number(req.params.idModule);
        const module = await em.findOne(Module_1.Module, { idModule });
        if (!module) {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }
        await em.persistAndFlush(module);
        res.status(201).json({ message: 'Module updated', module });
    }
    static async getModule(req, res) {
        const { idModule } = req.params;
        if (!idModule) {
            return res.status(400).json({ message: 'Module id is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const module = await em.findOne(Module_1.Module, { idModule: parseInt(idModule) });
        if (!module) {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }
        res.status(200).json(module);
    }
    static async getModules(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const modules = await em.find(Module_1.Module, {});
            res.json(modules);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch modules' });
        }
    }
    static async deleteModule(req, res) {
        const idModule = Number(req.params.id);
        if (!idModule) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const module = await em.findOne(Module_1.Module, { idModule: idModule });
            if (!module) {
                return res.status(404).json({ message: 'Module not found' });
            }
            await em.removeAndFlush(module);
            res.json(module);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete module' });
        }
    }
}
exports.default = ModuleController;
//# sourceMappingURL=ModuleController.js.map