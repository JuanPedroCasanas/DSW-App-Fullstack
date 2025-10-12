import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Module } from '../model/entities/Module';
import { Professional } from '../model/entities/Professional';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';
import { ModuleType } from '../model/entities/ModuleType';
import { NotFoundError } from '@mikro-orm/core';
import { BaseHttpError, NotConfigured } from '../model/errors/BaseHttpError';
import { DayOfWeek } from '../model/enums/DayOfWeek';
import { Appointment } from '../model/entities/Appointment';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';


export default class ModuleController  {

    //HELPERS
     private static calculateHours(startTime: string, endTime: string): number {
            let [startHours, startMinutes] = startTime.split(":").map(Number);
            let [endHours, endMinutes] = endTime.split(":").map(Number);

            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;

            let diffMinutes = endTotalMinutes - startTotalMinutes;

            if (diffMinutes < 0) {
            diffMinutes += 24 * 60;
            }

            let totalHours: number = diffMinutes / 60;
            return totalHours;
    }
    private static getDatesForDayOfWeek(dayNumber: DayOfWeek, month: number, year: number): Date[] {
        const dates: Date[] = [];
        const date = new Date(year, month - 1, 1);

        while (date.getMonth() === month - 1) {
            // date.getDay() devuelve 0 = domingo, 1 = lunes ... 6 = sábado
            if (date.getDay() !== 0 && date.getDay() === dayNumber % 7) {
                dates.push(new Date(date)); // copiar la fecha
            }
            date.setDate(date.getDate() + 1);
        }

        return dates;
    }


    static home(req: Request, res: Response) {
        res.send('Soy el controlador de modulos!');
    }


    static async addModules(req: Request, res: Response) {

        let { day, startTime, endTime, validMonth, validYear, professionalId, consultingRoomId } = req.body;

        if (!day) {
            return res.status(400).json({ message: 'Se requiere especificar el día.' });
        }

        if (!startTime) {
            return res.status(400).json({ message: 'Se requiere especificar la hora de inicio.' });
        }

        if (!endTime) {
            return res.status(400).json({ message: 'Se requiere especificar la hora de fin.' });
        }

        if (!validMonth) {
            return res.status(400).json({ message: 'Se requiere especificar un el mes de validez para el/los módulo(s).' });
        }

        if (!validYear) {
            return res.status(400).json({ message: 'Se requiere especificar el año de validez para el/los módulo(s).' });
        }

        if (!professionalId) {
            return res.status(400).json({ message: 'Se requiere el ID del profesional asignado al/los módulo(s).' });
        }

        if (!consultingRoomId) {
            return res.status(400).json({ message: 'Se requiere el ID del consultorio asignado al/los módulo(s).' });
        }

        try {
            const em = await getORM().em.fork();

            // Buscar entidades relacionadas
            const professional = await em.findOne(Professional, { id: professionalId });
            const consultingRoom = await em.findOne(ConsultingRoom, { idConsultingRoom: consultingRoomId });
            const moduleTypes = await em.findAll(ModuleType, { orderBy: { duration: 'DESC' } }); //Los ordeno de mayor a menor para hacer un calculo posterior

            if(!professional) {
                throw new NotFoundError('Profesional');
            }
            if(!consultingRoom) {
                throw new NotFoundError('Consultorio');
            }
            if(moduleTypes.length === 0) {
                throw new NotConfigured('Tipos de modulo')
            }

           let totalHours =  ModuleController.calculateHours(startTime, endTime);
           let dayOfWeek = Number(day) as DayOfWeek;

            //Calculo de tipos de modulo
            const moduleTypeAmount = [];

            for (const moduleType of moduleTypes) {
                const amount = Math.floor(totalHours / moduleType.duration);
                moduleTypeAmount.push(amount);
                if (amount > 0) {
                    totalHours -= amount * moduleType.duration;
                }
            }

            const modules: Module[] = [];
            for (let i = 0; i < moduleTypeAmount.length; i++) {
                const amount = moduleTypeAmount[i];
                const moduleType = moduleTypes[i];

                for (let j = 0; j < amount; j++) {
                    const newMod = new Module(
                    dayOfWeek,
                    startTime,
                    validMonth,
                    validYear,
                    professional,
                    consultingRoom,
                    moduleType
                    );

                    modules.push(newMod);
                    await em.persist(newMod);

                    // Sumar la duración en horas al startTime
                    let [hours, minutes] = startTime.split(":").map(Number);

                    const datesInMonth = ModuleController.getDatesForDayOfWeek(newMod.day, newMod.validMonth, newMod.validYear);

                    for (const date of datesInMonth) {
                        for (let k = 0; k < newMod.moduleType.duration; k++) {
                            const appointmentStart = new Date(newMod.validYear, newMod.validMonth - 1, date.getDate(), hours + k, minutes);
                            const appointmentEnd = new Date(newMod.validYear, newMod.validMonth - 1, date.getDate(), hours + k + 1, minutes);

                            const appointment = new Appointment(
                                newMod,
                                appointmentStart,
                                appointmentEnd,
                                professional,         
                                AppointmentStatus.Available,
                                undefined,
                                undefined,
                                undefined //Paciente, responsable legal y obra social se asignaran cuando se asigne el turno
                            );

                            await em.persist(appointment);
                            newMod.appointments.add(appointment);
                        }
                    }

                    //Sumo las horas para el proximo modulo
                    hours += moduleType.duration;

                    if (hours >= 24) hours -= 24; // No se da nunca este caso pero safeguard por las dudas

                    //Vuelvo a ponerlo en formato hh:mm para el proximo modulo
                    startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                }
            }

            await em.flush()

            


            res.status(201).json({ message: 'Modulos correctamente añadidos', modules });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al crear los modulos' });
            }
        }
    }


    //FALTA CHECKEAR, HACE FALTA?
    static async updateModule(req: Request, res: Response) {
        const { day,startTime,validMonth, professionalId, consultingRoom, moduleType} = req.body;

        if(!day)
        {
            return res.status(400).json({ message: 'Module day is required' });
        }
        if(!startTime)
        {
            return res.status(400).json({ message: 'Module start time is required' });
        }
        if(!validMonth)
        {
            return res.status(400).json({ message: 'Module valid month is required' });
        }
        if(!professionalId)
        {
            return res.status(400).json({ message: 'Module professional id is required' });
        }
        if(!consultingRoom)
        {
            return res.status(400).json({ message: 'Module consulting room is required' });
        }
        if(!moduleType)
        {
            return res.status(400).json({ message: 'Module type is required' });
        }
    
        const em = await getORM().em.fork();
        const idModule = Number(req.params.idModule);
        const module = await em.findOne(Module, { idModule });


        if(!module)
        {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }

        await em.persistAndFlush(module);

        res.status(201).json({ message: 'Module updated', module });
    }

    //CORREGIR
    static async getModule(req: Request, res: Response) {
        const { idModule } = req.params;

        if(!idModule)
        {
            return res.status(400).json({ message: 'Module id is required' });
        }

        const em = await getORM().em.fork();
        const module = await em.findOne(Module, { idModule: parseInt(idModule) });

        if(!module) 
        {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }

        res.status(200).json(module);
    }

    //CORREGIR
    static async getModules(req: Request, res: Response) {
            try {
                const em = await getORM().em.fork();
                const modules = await em.find(Module, {});
                res.json(modules);
    
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to fetch modules' });
            }
        }
    
        static async deleteModule(req: Request, res: Response) {
            const id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ message: 'Appointment id is required' });
            }
            try {
    
                const em = await getORM().em.fork();
                const module = await em.findOne(Module, { idModule : id });
    
                if (!module) {
                    return res.status(404).json({ message: 'Module not found' });
                }
    
                await em.removeAndFlush(module);
                res.json(module);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to delete module' });
            }
        }
    
    
    }