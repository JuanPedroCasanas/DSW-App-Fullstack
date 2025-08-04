"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultingRoomController = void 0;
const db_1 = require("../orm/db");
const ConsultingRoom_1 = require("../model/entities/ConsultingRoom");
class ConsultingRoomController {
    static home(req, res) {
        res.send('Soy el controlador de ocupaciones!');
    }
    static async addConsultingRoom(req, res) {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
            const consultingRoom = new ConsultingRoom_1.ConsultingRoom(description);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(consultingRoom);
            res.status(201).json({ message: 'ConsultingRoom added', consultingRoom });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add consulting room' });
        }
    }
    static async updateConsultingRoom(req, res) {
        const { idConsultingRoom } = req.body;
        const { description } = req.body;
        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'ConsultingRoom id is required' });
        }
        if (!description) {
            return res.status(400).json({ message: 'ConsultingRoom new name is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: idConsultingRoom });
        if (!consultingRoom) {
            return res.status(400).json({ message: 'ConsultingRoom not found' });
            // throw new Error("Ocupacion no encontrada");
        }
        consultingRoom.description = description;
        await em.persistAndFlush(ConsultingRoom_1.ConsultingRoom);
        res.status(201).json({ message: 'ConsultingRoom updated', consultingRoom });
    }
    static async getConsultingRoom(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'ConsultingRoom id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: id });
            if (!consultingRoom) {
                return res.status(404).json({ message: 'ConsultingRoom not found' });
            }
            res.json(consultingRoom);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch ConsultingRoom' });
        }
    }
    static async getConsultingRooms(req, res) {
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRooms = await em.find(ConsultingRoom_1.ConsultingRoom, {});
            res.json(consultingRooms);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch ConsultingRooms' });
        }
    }
    static async deleteConsultingRoom(req, res) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);
        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'ConsultingRoom id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: idConsultingRoom });
            if (!consultingRoom) {
                return res.status(404).json({ message: 'ConsultingRoom not found' });
            }
            await em.removeAndFlush(consultingRoom);
            res.json(consultingRoom);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete ConsultingRoom' });
        }
    }
}
exports.ConsultingRoomController = ConsultingRoomController;
//# sourceMappingURL=ConsultingRoomController.js.map