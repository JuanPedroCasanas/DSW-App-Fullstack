import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Appointment } from '../model/entities/Appointment';
import { Patient } from '../model/entities/Patient';
import { Professional } from '../model/entities/Professional';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { AppointmentNotAvailableError, BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';

export class AppointmentController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de turnos!');
    }

    static async assignAppointment(req: Request, res: Response) {
        const { idAppointment, idPatient } = req.body;

        if(!idAppointment) {
            return res.status(400).json({ message: 'Se requiere el id de turno a asignar' });
        }
        if(!idPatient) {
            return res.status(400).json({ message: 'Se requiere el id de paciente a asignar' });
        }

        try {
            const em = await getORM().em.fork();

            const appointment = await em.findOne(Appointment, { id : idAppointment });
            if(!appointment) {
                throw new NotFoundError('Turno');
            } 

            if(appointment.status != AppointmentStatus.Available) {
                throw new AppointmentNotAvailableError();
            }

            const patient = await em.findOne(Patient, { id: idPatient })
            if(!patient) {
                throw new NotFoundError('Paciente');
            }

            const legalGuardian = patient.legalGuardian;


            appointment.legalGuardian = legalGuardian;
            appointment.patient = patient;
            appointment.healthInsurance = patient.healthInsurance;
            appointment.status = AppointmentStatus.Scheduled;

            await em.flush();
            res.status(200).json({ message: 'Se asigno correctamente el paciente al turno', appointment})

            } catch (error) {
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    res.status(500).json({ message: 'Error al asignar turno' });
                }
            }

    }

    //Solo los profesionales y pacientes pueden cancelar turnos
    static async cancelAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        try {
        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            throw new NotFoundError('Turno');
        }

        appointment.status = AppointmentStatus.Canceled
        await em.flush();

        res.status(201).json({ message: 'El turno se canceló correctamente', appointment });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al cancelar el turno' });
            }
        }
    }

    //Solo los profesionales pueden completar turnos
    static async completeAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        try {
            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, { id: id });

            if(!appointment)
            {
                throw new NotFoundError('Turno');
            }

            appointment.status = AppointmentStatus.Completed
            await em.flush();

            res.status(201).json({ message: 'El turno se completó correctamente', appointment });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error completar turno' });
            }
        }
    }

    //Solo los profesionales pueden marcar turnos como sin asistencia
    static async missAppointment(req: Request, res: Response) {
        const { id } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de turno a modificar' });
        }

        try {
            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, { id: id });

            if(!appointment)
            {
                throw new NotFoundError('Turno');
            }

            appointment.status = AppointmentStatus.Missed
            await em.flush();

            res.status(201).json({ message: 'El turno se marcó como  correctamente', appointment });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al marcar turno como \'Sin asistencia\'' });
            }
        }
    }


    static async getAppointment(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Se requiere el id del turno a buscar' });
        }
        try {
            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, { id: id });
            if (!appointment) {
                throw new NotFoundError('Turno');
            }
            res.json(appointment);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el turno' });
            }
        }
    }

    static async getAppointments(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const appointments = await em.findAll(Appointment);
            res.json(appointments);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }


}