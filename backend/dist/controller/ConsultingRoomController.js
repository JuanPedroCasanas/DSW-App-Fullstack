"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultingRoomController = void 0;
const db_1 = require("../orm/db");
const ConsultingRoom_1 = require("../model/entities/ConsultingRoom");
const BaseHttpError_1 = require("../model/errors/BaseHttpError");
const Module_1 = require("../model/entities/Module");
const ModuleStatus_1 = require("../model/enums/ModuleStatus");
const AppointmentStatus_1 = require("../model/enums/AppointmentStatus");
class ConsultingRoomController {
    static home(req, res) {
        res.send('Soy el controlador de consultorios!');
    }
    static async addConsultingRoom(req, res) {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: 'Se requiere una descripción, ej: Consultorio 1' });
        }
        try {
            const consultingRoom = new ConsultingRoom_1.ConsultingRoom(description);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(consultingRoom);
            res.status(201).json({ message: 'Se agrego correctamente el consultorio', consultingRoom });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir el consultorio' });
        }
    }
    static async updateConsultingRoom(req, res) {
        const { idConsultingRoom } = req.body;
        const { description } = req.body;
        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }
        if (!description) {
            return res.status(400).json({ message: 'Se requiere una nueva descripción de consultorio' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: idConsultingRoom });
            if (!consultingRoom) {
                throw new BaseHttpError_1.NotFoundError('Consultorio');
            }
            consultingRoom.description = description;
            await em.persistAndFlush(ConsultingRoom_1.ConsultingRoom);
            res.status(201).json({ message: 'ConsultingRoom updated', consultingRoom });
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al agregar consultorio' });
            }
        }
    }
    static async getConsultingRoom(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: id });
            if (!consultingRoom) {
                throw new BaseHttpError_1.NotFoundError('Consultorio');
            }
            res.json(consultingRoom);
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar consultorio' });
            }
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
            res.status(500).json({ message: 'Error al buscar consultorios' });
        }
    }
    static async deleteConsultingRoom(req, res) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);
        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom_1.ConsultingRoom, { idConsultingRoom: idConsultingRoom });
            if (!consultingRoom) {
                throw new BaseHttpError_1.NotFoundError('Consultorio');
            }
            const consultingRoomModules = await em.find(Module_1.Module, { consultingRoom: consultingRoom });
            //Se cancelan todos los modulos asociados al consultorio y por ende todos los turnos asociados a cada modulo asociado al consultorio
            if (consultingRoomModules.length != 0) {
                for (const module of consultingRoomModules) {
                    module.status = ModuleStatus_1.ModuleStatus.Canceled;
                    await module.appointments.init(); // Las colecciones entiendo son lazy loaded, espero a que carguen
                    for (const appointment of module.appointments) {
                        appointment.status = AppointmentStatus_1.AppointmentStatus.Canceled;
                    }
                }
            }
            await em.flush();
        }
        catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError_1.BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al borrar consultorio' });
            }
        }
    }
}
exports.ConsultingRoomController = ConsultingRoomController;
//# sourceMappingURL=ConsultingRoomController.js.map