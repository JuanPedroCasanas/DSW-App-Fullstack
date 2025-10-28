import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Module } from '../model/entities/Module';
import { Professional } from '../model/entities/Professional';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';
import { ModuleType } from '../model/entities/ModuleType';
import { BaseHttpError, ModuleScheduleConflictError, NotConfigured, NotFoundError } from '../model/errors/BaseHttpError';
import { DayOfWeek } from '../model/enums/DayOfWeek';
import { Appointment } from '../model/entities/Appointment';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { ModuleStatus } from '../model/enums/ModuleStatus';
import { safeSerialize } from '../utils/safeSerialize';


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
        return res.send('Soy el controlador de modulos!');
    }


    static async addModules(req: Request, res: Response) {

        let { day, startTime, endTime, validMonth, validYear, idProfessional, idConsultingRoom } = req.body;

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

        if (!idProfessional) {
            return res.status(400).json({ message: 'Se requiere el ID del profesional asignado al/los módulo(s).' });
        }

        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'Se requiere el ID del consultorio asignado al/los módulo(s).' });
        }

        try {
            const em = await getORM().em.fork();

            // Buscar entidades relacionadas
            const professional = await em.findOne(Professional, { id: idProfessional });
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });
            const moduleTypes = await em.findAll(ModuleType, { orderBy: { duration: 'DESC' } }); //Los ordeno de mayor a menor para hacer un calculo posterior


            if(!professional || !professional?.isActive) {
                throw new NotFoundError('Profesional');
            }
            if(!consultingRoom || !consultingRoom?.isActive) {
                throw new NotFoundError('Consultorio');
            }
            if(moduleTypes.length === 0) {
                throw new NotConfigured('Tipos de modulo')
            }

            //Casteo el numero al día de la semana que uso en el back
            let dayOfWeek = Number(day) as DayOfWeek;

            //Checkear que efectivamente no haya ningun modulo ya alquilado en el rango horario
            const conflictingModules = await em.find(Module, {
                consultingRoom: consultingRoom,
                day: dayOfWeek,
                validMonth: Number(validMonth),
                validYear: Number(validYear),
                startTime: { $lt: endTime }, //Modulos que empiecen Antes de que termine nuestro nuevo modulo
                endTime: { $gt: startTime }, // Y que terminen despues de que empiece nuestro nuevo modulo
                status: { $ne: ModuleStatus.Canceled } // NO cancelados
            });

            if (conflictingModules.length > 0) {
                throw new ModuleScheduleConflictError(startTime, endTime);
            }

           let totalHours =  ModuleController.calculateHours(startTime, endTime);


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
                    Number(validMonth),
                    Number(validYear),
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
                            //Resto -3 para almacenarlo como GMT-3
                            const appointmentStart = new Date(newMod.validYear, newMod.validMonth - 1, date.getDate(), hours + k - 3, minutes); 
                            const appointmentEnd = new Date(newMod.validYear, newMod.validMonth - 1, date.getDate(), hours + k + 1 - 3, minutes);
                            
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

            await em.flush();

            


            return res.status(201).json({ message: 'Modulos correctamente añadidos', modules: safeSerialize(modules) });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al crear los modulos' });
            }
        }
    }


    //METODO MAL HECHO, VERIFICAR SI HACE FALTA, PARA MI NO.
    static async updateModule(req: Request, res: Response) {
        const { day,startTime,validMonth, idProfessional, consultingRoom, moduleType} = req.body;

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
        if(!idProfessional)
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
        const module = await em.findOne(Module, { id : idModule });


        if(!module)
        {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }

        await em.persistAndFlush(module);

        return res.status(201).json({ message: 'Module updated', module });
    }

    static async getModule(req: Request, res: Response) {
        const idModule = Number(req.params.id);

        if(!idModule)
        {
            return res.status(400).json({ message: 'Se requiere el id de modulo' });
        }
        try {

            const em = await getORM().em.fork();
            const module = await em.findOne(Module, { id: idModule });

            if(!module) 
            {
                throw new NotFoundError("Modulo");
            }

            return res.status(200).json(module);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error buscar modulo' });
            }
        }
    }

    static async getModules(req: Request, res: Response) {
            try {
                const em = await getORM().em.fork();

                const modules = await em.findAll(Module, {
                    populate: ["professional", "consultingRoom", "moduleType"],
                });

                return res.status(200).json(modules);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to fetch modules' });
            }
        }

    static async getCurrentMonthModulesByConsultingRoom(req: Request, res: Response) {
            const idConsultingRoom = Number(req.params.id);
            const currentDate: Date = new Date();
            const currentMonth: number = (currentDate.getMonth()) + 1; //getMonth devuelve un valor del 0 al 11, por eso le sumo 1
            const currentYear: number = currentDate.getFullYear();
            if(!idConsultingRoom)
            {
                return res.status(400).json({ message: 'Se requiere el id de consultorio' });
            }
            try {

                const em = await getORM().em.fork();
                const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

                if(!consultingRoom || !consultingRoom.isActive) {
                    throw new NotFoundError("Consultorio");
                }

                const modules = await em.find(Module, { consultingRoom : consultingRoom, validYear: currentYear, validMonth: currentMonth });
                return res.status(200).json(safeSerialize(modules));

            } catch (error) {
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    return res.status(500).json({ message: 'Error buscar modulo' });
                }
            }
        }
    }