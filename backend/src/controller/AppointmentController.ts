import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Appointment } from '../model/entities/Appointment';
import { Patient } from '../model/entities/Patient';
import { Professional } from '../model/entities/Professional';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';

export class AppointmentController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de turnos!');
    }

    static async addAppointment(req: Request, res: Response) {
        const { startTime, idProfessional, idPatient, idHealthInsurance, idLegalGuardian} = req.body;

        if (!startTime) {
            return res.status(400).json({ message: 'Se requiere una fecha-hora de inicio valida' }); //Esto es el horario estimo, corregir
        }
        if (!idProfessional) {
            return res.status(400).json({ message: 'Se requiere Id del profesional asignado' });
        }
        if(!idPatient) {
            return res.status(400).json({ message: 'Se requiere Id del paciente solicitante' });
        }

        try {
            const em = await getORM().em.fork();

            let patient = await em.findOne(Patient, { idPatient: idPatient });
            if(!patient) {
                return res.status(404).json({ message: 'El ID de paciente ingresado no es valido' });
            }

            let professional = await em.findOne(Professional, { id: idProfessional});
            if(!professional) {
                return res.status(404).json({ message: 'El ID de profesional ingresado no es valido' });
            }

            //EVALUAR SI ESTO HAY QUE PASARLO POR ID O SACARLO DEL PACIENTE/PROFESIONAL, ej: patient.currentHealthInsurance()
            
            let healthInsurance: HealthInsurance | undefined;
            if(idHealthInsurance) {
            healthInsurance = await em.findOne(HealthInsurance, { idHealthInsurance: idHealthInsurance}) ?? undefined;;
                if(!healthInsurance) {
                    return res.status(404).json({ message: 'El ID de obra social ingresado no es valido' });
                }
            }

            let legalGuardian: LegalGuardian | undefined;
            legalGuardian = patient.legalGuardian;

            let endTime: Date = new Date(startTime.getTime() + 60 * 60 * 1000); //EndTime es siempre startTime + 1 hora

            const appointment = new Appointment(startTime, endTime, professional, patient, AppointmentStatus.Scheduled, healthInsurance, legalGuardian);
            
            
            await em.persistAndFlush(appointment);

            res.status(201).json({ message: 'El turno:\n' + appointment + '\nSe añadió correctamente!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir el turno.' });
        }
    }

    static async updateAppointmentStartTime(req: Request, res: Response) {
        const { id } = req.body;
        const { startTime } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }
        if(!startTime)
        {
            return res.status(400).json({ message: 'Se requiere la nueva fecha a reprogramar del turno' });
        }

        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }

        appointment.startTime = startTime;
        appointment.endTime = new Date(startTime.getTime() + 60 * 60 * 1000); //EndTime es siempre startTime + 1 hora

        await em.persistAndFlush(Appointment);

        res.status(201).json({ message: 'La fecha-hora del turno se actualizó correctamente', appointment });
    }

    //Solo los profesionales y pacientes pueden cancelar turnos
    static async cancelAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }

        appointment.status = AppointmentStatus.Canceled
        await em.persistAndFlush(Appointment);

        res.status(201).json({ message: 'El turno se canceló correctamente', appointment });
    }

    //Solo los profesionales pueden completar turnos
    static async completeAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }

        appointment.status = AppointmentStatus.Completed
        await em.persistAndFlush(Appointment);

        res.status(201).json({ message: 'El turno se completó correctamente', appointment });
    }

    //Solo los profesionales pueden marcar turnos como sin asistencia
    static async missAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            return res.status(400).json({ message: 'No se encontro el turno a modificar' });
        }

        appointment.status = AppointmentStatus.Missed
        await em.persistAndFlush(Appointment);

        res.status(201).json({ message: 'El turno se marcó como \'Sin asistencia\' correctamente', appointment });
    }


    static async getAppointment(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, { id: id });
            if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json(appointment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointment' });
        }
    }

    static async getAppointments(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const appointments = await em.find(Appointment, {});
            res.json(appointments);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }
    }

    static async deleteAppointment(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, id);

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            await em.removeAndFlush(appointment);
            res.json(appointment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete appointment' });
        }
    }


}